from django.contrib import admin
from .models import AttendanceRecord


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    """Admin configuration for AttendanceRecord model."""
    
    list_display = [
        'student', 'session', 'distance_from_center', 
        'is_verified', 'marked_at'
    ]
    list_filter = ['is_verified', 'marked_at', 'session__subject_name']
    search_fields = [
        'student__email', 'student__first_name', 'student__last_name',
        'session__subject_name'
    ]
    ordering = ['-marked_at']
    readonly_fields = ['marked_at', 'distance_from_center']
    
    fieldsets = (
        ('Attendance Details', {
            'fields': ('session', 'student', 'is_verified')
        }),
        ('Location Data', {
            'fields': ('marked_latitude', 'marked_longitude', 'distance_from_center')
        }),
        ('Additional Info', {
            'fields': ('marked_at', 'notes')
        }),
    )
