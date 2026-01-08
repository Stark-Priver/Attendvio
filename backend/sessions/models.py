"""
Models for attendance sessions.
"""
from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from accounts.models import User


class AttendanceSession(models.Model):
    """
    Model for attendance sessions created by teachers.
    Includes geofencing parameters and time constraints.
    """
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('ENDED', 'Ended'),
        ('SCHEDULED', 'Scheduled'),
    ]
    
    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sessions',
        limit_choices_to={'role': 'TEACHER'}
    )
    subject_name = models.CharField(max_length=200)
    
    # Geofencing parameters
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    radius = models.IntegerField(
        default=50,
        validators=[MinValueValidator(10)],
        help_text='Radius in meters'
    )
    
    # Time constraints
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='SCHEDULED')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_sessions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['teacher', 'status']),
            models.Index(fields=['start_time', 'end_time']),
        ]
    
    def __str__(self):
        return f"{self.subject_name} - {self.teacher.get_full_name()}"
    
    def is_active(self):
        """Check if session is currently active."""
        now = timezone.now()
        return (
            self.status == 'ACTIVE' and
            self.start_time <= now <= self.end_time
        )
    
    def save(self, *args, **kwargs):
        """Auto-update status based on time."""
        now = timezone.now()
        if self.start_time <= now <= self.end_time:
            self.status = 'ACTIVE'
        elif now > self.end_time:
            self.status = 'ENDED'
        else:
            self.status = 'SCHEDULED'
        super().save(*args, **kwargs)
