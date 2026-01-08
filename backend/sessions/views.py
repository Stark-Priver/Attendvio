"""
Views for attendance session management.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import AttendanceSession
from .serializers import AttendanceSessionSerializer, SessionListSerializer
from .permissions import IsTeacher


class AttendanceSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing attendance sessions.
    Teachers can create, update, and delete sessions.
    Students can only view active sessions.
    """
    queryset = AttendanceSession.objects.all()
    serializer_class = AttendanceSessionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'teacher']
    search_fields = ['subject_name']
    ordering_fields = ['start_time', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use lightweight serializer for list view."""
        if self.action == 'list':
            return SessionListSerializer
        return AttendanceSessionSerializer
    
    def get_queryset(self):
        """Filter sessions based on user role."""
        user = self.request.user
        
        if user.is_teacher():
            # Teachers see only their own sessions
            return AttendanceSession.objects.filter(teacher=user)
        elif user.is_student():
            # Students see only active sessions
            now = timezone.now()
            return AttendanceSession.objects.filter(
                status='ACTIVE',
                start_time__lte=now,
                end_time__gte=now
            )
        
        return AttendanceSession.objects.none()
    
    def perform_create(self, serializer):
        """Set the teacher to the current user."""
        if not self.request.user.is_teacher():
            raise PermissionError("Only teachers can create sessions.")
        serializer.save(teacher=self.request.user)
    
    def update(self, request, *args, **kwargs):
        """Only teachers can update sessions."""
        if not request.user.is_teacher():
            return Response(
                {'error': 'Only teachers can update sessions.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Only teachers can delete sessions."""
        if not request.user.is_teacher():
            return Response(
                {'error': 'Only teachers can delete sessions.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], permission_classes=[IsTeacher])
    def end_session(self, request, pk=None):
        """Manually end an active session."""
        session = self.get_object()
        
        if session.status != 'ACTIVE':
            return Response(
                {'error': 'Only active sessions can be ended.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session.status = 'ENDED'
        session.save()
        
        return Response({
            'message': 'Session ended successfully.',
            'session': AttendanceSessionSerializer(session).data
        })
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all currently active sessions."""
        now = timezone.now()
        active_sessions = self.get_queryset().filter(
            status='ACTIVE',
            start_time__lte=now,
            end_time__gte=now
        )
        
        serializer = SessionListSerializer(active_sessions, many=True)
        return Response(serializer.data)
