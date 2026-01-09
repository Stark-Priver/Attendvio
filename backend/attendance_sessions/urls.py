"""
URL patterns for sessions app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceSessionViewSet

router = DefaultRouter()
router.register(r'', AttendanceSessionViewSet, basename='session')

app_name = 'attendance_sessions'

urlpatterns = [
    path('', include(router.urls)),
]
