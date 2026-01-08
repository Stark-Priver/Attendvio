"""
URL patterns for reports app.
"""
from django.urls import path
from .views import (
    SessionReportView,
    ExportSessionCSV,
    TeacherDashboardView,
    StudentDashboardView
)

app_name = 'reports'

urlpatterns = [
    path('session/<int:session_id>/', SessionReportView.as_view(), name='session_report'),
    path('session/<int:session_id>/export/', ExportSessionCSV.as_view(), name='export_csv'),
    path('teacher/dashboard/', TeacherDashboardView.as_view(), name='teacher_dashboard'),
    path('student/dashboard/', StudentDashboardView.as_view(), name='student_dashboard'),
]
