"""
Views for attendance management.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import AttendanceRecord
from .serializers import (
    MarkAttendanceSerializer,
    AttendanceRecordSerializer,
    StudentAttendanceHistorySerializer
)
from attendance_sessions.permissions import IsStudent


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing attendance records.
    Students can mark attendance and view their history.
    Teachers can view attendance for their sessions.
    """
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['session', 'student', 'is_verified']
    ordering_fields = ['marked_at']
    ordering = ['-marked_at']
    
    def get_queryset(self):
        """Filter attendance records based on user role."""
        user = self.request.user
        
        if user.is_teacher():
            # Teachers see attendance for their sessions
            return AttendanceRecord.objects.filter(session__teacher=user)
        elif user.is_student():
            # Students see only their own attendance
            return AttendanceRecord.objects.filter(student=user)
        
        return AttendanceRecord.objects.none()
    
    def get_serializer_class(self):
        """Use appropriate serializer based on action."""
        if self.action == 'mark':
            return MarkAttendanceSerializer
        elif self.action == 'my_history':
            return StudentAttendanceHistorySerializer
        return AttendanceRecordSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[IsStudent])
    def mark(self, request):
        """Mark attendance for a session (students only)."""
        serializer = MarkAttendanceSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        attendance = serializer.save()
        
        return Response({
            'message': 'Attendance marked successfully.',
            'attendance': AttendanceRecordSerializer(attendance).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[IsStudent])
    def my_history(self, request):
        """Get attendance history for the current student."""
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = StudentAttendanceHistorySerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = StudentAttendanceHistorySerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_session(self, request):
        """Get attendance records for a specific session."""
        session_id = request.query_params.get('session_id')
        
        if not session_id:
            return Response(
                {'error': 'session_id parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.get_queryset().filter(session_id=session_id)
        serializer = AttendanceRecordSerializer(queryset, many=True)
        
        return Response({
            'session_id': session_id,
            'total_attendance': queryset.count(),
            'records': serializer.data
        })
