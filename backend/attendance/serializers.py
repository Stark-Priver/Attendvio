"""
Serializers for attendance records.
"""
from rest_framework import serializers
from django.utils import timezone
from .models import AttendanceRecord
from .utils import is_within_geofence
from sessions.models import AttendanceSession


class MarkAttendanceSerializer(serializers.Serializer):
    """Serializer for marking attendance."""
    session_id = serializers.IntegerField()
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    
    def validate_session_id(self, value):
        """Validate that session exists and is active."""
        try:
            session = AttendanceSession.objects.get(id=value)
        except AttendanceSession.DoesNotExist:
            raise serializers.ValidationError("Session does not exist.")
        
        if not session.is_active():
            raise serializers.ValidationError("Session is not currently active.")
        
        return value
    
    def validate(self, data):
        """Validate geofencing and duplicate attendance."""
        session = AttendanceSession.objects.get(id=data['session_id'])
        student = self.context['request'].user
        
        # Check for duplicate attendance
        if AttendanceRecord.objects.filter(session=session, student=student).exists():
            raise serializers.ValidationError({
                "error": "You have already marked attendance for this session."
            })
        
        # Validate geofencing
        is_within, distance = is_within_geofence(
            data['latitude'],
            data['longitude'],
            session.latitude,
            session.longitude,
            session.radius
        )
        
        if not is_within:
            raise serializers.ValidationError({
                "error": f"You are outside the allowed area. Distance: {distance:.2f}m, Required: {session.radius}m"
            })
        
        data['session'] = session
        data['distance'] = distance
        
        return data
    
    def create(self, validated_data):
        """Create attendance record."""
        session = validated_data['session']
        student = self.context['request'].user
        
        attendance = AttendanceRecord.objects.create(
            session=session,
            student=student,
            marked_latitude=validated_data['latitude'],
            marked_longitude=validated_data['longitude'],
            distance_from_center=validated_data['distance']
        )
        
        return attendance


class AttendanceRecordSerializer(serializers.ModelSerializer):
    """Serializer for AttendanceRecord model."""
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    session_name = serializers.CharField(source='session.subject_name', read_only=True)
    
    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'session', 'session_name', 'student', 'student_name', 'student_id',
            'marked_latitude', 'marked_longitude', 'distance_from_center',
            'marked_at', 'is_verified', 'notes'
        ]
        read_only_fields = ['id', 'marked_at']


class StudentAttendanceHistorySerializer(serializers.ModelSerializer):
    """Lightweight serializer for student attendance history."""
    session_name = serializers.CharField(source='session.subject_name', read_only=True)
    teacher_name = serializers.CharField(source='session.teacher.get_full_name', read_only=True)
    
    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'session_name', 'teacher_name',
            'marked_at', 'distance_from_center'
        ]
