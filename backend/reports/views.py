"""
Views for generating attendance reports and analytics.
"""
import csv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.db.models import Count, Q
from attendance.models import AttendanceRecord
from sessions.models import AttendanceSession
from sessions.permissions import IsTeacher


class SessionReportView(APIView):
    """
    Get detailed report for a specific session.
    Teachers only.
    """
    permission_classes = [IsAuthenticated, IsTeacher]
    
    def get(self, request, session_id):
        """Generate report for a session."""
        try:
            session = AttendanceSession.objects.get(id=session_id, teacher=request.user)
        except AttendanceSession.DoesNotExist:
            return Response(
                {'error': 'Session not found or you do not have permission to view it.'},
                status=404
            )
        
        # Get attendance records
        attendance_records = AttendanceRecord.objects.filter(session=session).select_related('student')
        
        # Calculate statistics
        total_attendance = attendance_records.count()
        verified_count = attendance_records.filter(is_verified=True).count()
        
        # Prepare data
        attendees = [{
            'student_id': record.student.student_id,
            'student_name': record.student.get_full_name(),
            'email': record.student.email,
            'department': record.student.department,
            'marked_at': record.marked_at,
            'distance': round(record.distance_from_center, 2),
            'is_verified': record.is_verified
        } for record in attendance_records]
        
        return Response({
            'session': {
                'id': session.id,
                'subject_name': session.subject_name,
                'start_time': session.start_time,
                'end_time': session.end_time,
                'status': session.status
            },
            'statistics': {
                'total_attendance': total_attendance,
                'verified_attendance': verified_count,
                'unverified_attendance': total_attendance - verified_count
            },
            'attendees': attendees
        })


class ExportSessionCSV(APIView):
    """
    Export session attendance as CSV.
    Teachers only.
    """
    permission_classes = [IsAuthenticated, IsTeacher]
    
    def get(self, request, session_id):
        """Export attendance records as CSV."""
        try:
            session = AttendanceSession.objects.get(id=session_id, teacher=request.user)
        except AttendanceSession.DoesNotExist:
            return Response(
                {'error': 'Session not found or you do not have permission to view it.'},
                status=404
            )
        
        # Create CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="attendance_{session_id}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Student ID', 'Student Name', 'Email', 'Department',
            'Marked At', 'Distance (m)', 'Verified'
        ])
        
        # Write attendance records
        attendance_records = AttendanceRecord.objects.filter(session=session).select_related('student')
        for record in attendance_records:
            writer.writerow([
                record.student.student_id,
                record.student.get_full_name(),
                record.student.email,
                record.student.department,
                record.marked_at.strftime('%Y-%m-%d %H:%M:%S'),
                round(record.distance_from_center, 2),
                'Yes' if record.is_verified else 'No'
            ])
        
        return response


class TeacherDashboardView(APIView):
    """
    Get dashboard statistics for teachers.
    """
    permission_classes = [IsAuthenticated, IsTeacher]
    
    def get(self, request):
        """Get teacher dashboard data."""
        teacher = request.user
        
        # Get session statistics
        sessions = AttendanceSession.objects.filter(teacher=teacher)
        total_sessions = sessions.count()
        active_sessions = sessions.filter(status='ACTIVE').count()
        ended_sessions = sessions.filter(status='ENDED').count()
        
        # Get attendance statistics
        total_attendance = AttendanceRecord.objects.filter(session__teacher=teacher).count()
        
        # Recent sessions
        recent_sessions = sessions.order_by('-created_at')[:5].values(
            'id', 'subject_name', 'start_time', 'end_time', 'status'
        )
        
        return Response({
            'statistics': {
                'total_sessions': total_sessions,
                'active_sessions': active_sessions,
                'ended_sessions': ended_sessions,
                'total_attendance': total_attendance
            },
            'recent_sessions': list(recent_sessions)
        })


class StudentDashboardView(APIView):
    """
    Get dashboard statistics for students.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get student dashboard data."""
        if not request.user.is_student():
            return Response(
                {'error': 'Only students can access this endpoint.'},
                status=403
            )
        
        student = request.user
        
        # Get attendance statistics
        attendance_records = AttendanceRecord.objects.filter(student=student)
        total_attendance = attendance_records.count()
        
        # Recent attendance
        recent_attendance = attendance_records.order_by('-marked_at')[:10].values(
            'session__subject_name',
            'session__teacher__first_name',
            'session__teacher__last_name',
            'marked_at',
            'distance_from_center'
        )
        
        return Response({
            'statistics': {
                'total_attendance': total_attendance
            },
            'recent_attendance': list(recent_attendance)
        })
