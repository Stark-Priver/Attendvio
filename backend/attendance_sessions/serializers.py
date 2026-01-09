"""
Serializers for attendance sessions.
"""
from rest_framework import serializers
from django.utils import timezone
from .models import AttendanceSession
from accounts.serializers import UserSerializer


class AttendanceSessionSerializer(serializers.ModelSerializer):
    """Serializer for AttendanceSession model."""
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    is_active = serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceSession
        fields = [
            'id', 'teacher', 'teacher_name', 'subject_name',
            'latitude', 'longitude', 'radius',
            'start_time', 'end_time', 'status', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'teacher', 'status', 'created_at', 'updated_at']
    
    def get_is_active(self, obj):
        """Check if session is currently active."""
        return obj.is_active()
    
    def validate(self, data):
        """Validate session time constraints."""
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        
        if start_time and end_time:
            if end_time <= start_time:
                raise serializers.ValidationError({
                    "end_time": "End time must be after start time."
                })
            
            # Check if start_time is not too far in the past
            now = timezone.now()
            if start_time < now - timezone.timedelta(hours=1):
                raise serializers.ValidationError({
                    "start_time": "Cannot create session with start time more than 1 hour in the past."
                })
        
        return data
    
    def validate_radius(self, value):
        """Validate radius is reasonable."""
        if value < 10:
            raise serializers.ValidationError("Radius must be at least 10 meters.")
        if value > 1000:
            raise serializers.ValidationError("Radius cannot exceed 1000 meters.")
        return value


class SessionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for session lists."""
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    is_active = serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceSession
        fields = [
            'id', 'subject_name', 'teacher_name',
            'start_time', 'end_time', 'status', 'is_active'
        ]
    
    def get_is_active(self, obj):
        """Check if session is currently active."""
        return obj.is_active()
