from django.contrib import admin
from .models import AttendanceSession


@admin.register(AttendanceSession)
class AttendanceSessionAdmin(admin.ModelAdmin):
    """Admin configuration for AttendanceSession model."""
    
    list_display = ['subject_name', 'teacher', 'status', 'start_time', 'end_time', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['subject_name', 'teacher__email', 'teacher__first_name', 'teacher__last_name']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Session Details', {
            'fields': ('teacher', 'subject_name', 'status')
        }),
        ('Geofencing', {
            'fields': ('latitude', 'longitude', 'radius')
        }),
        ('Time Constraints', {
            'fields': ('start_time', 'end_time')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
