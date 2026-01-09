"""
Models for attendance records.
"""
from django.db import models
from django.core.exceptions import ValidationError
from accounts.models import User
from attendance_sessions.models import AttendanceSession


class AttendanceRecord(models.Model):
    """
    Model for individual attendance records.
    Each student can mark attendance only once per session.
    """
    session = models.ForeignKey(
        AttendanceSession,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='attendances',
        limit_choices_to={'role': 'STUDENT'}
    )
    
    # Location data at time of marking attendance
    marked_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    marked_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    distance_from_center = models.FloatField(help_text='Distance in meters from session location')
    
    # Timestamp
    marked_at = models.DateTimeField(auto_now_add=True)
    
    # Metadata
    is_verified = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'attendance_records'
        ordering = ['-marked_at']
        unique_together = [['session', 'student']]
        indexes = [
            models.Index(fields=['session', 'student']),
            models.Index(fields=['marked_at']),
        ]
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.session.subject_name}"
    
    def clean(self):
        """Validate attendance record."""
        # Check if student already marked attendance for this session
        if self.pk is None:  # Only for new records
            existing = AttendanceRecord.objects.filter(
                session=self.session,
                student=self.student
            ).exists()
            
            if existing:
                raise ValidationError("Attendance already marked for this session.")
    
    def save(self, *args, **kwargs):
        """Validate before saving."""
        self.full_clean()
        super().save(*args, **kwargs)
