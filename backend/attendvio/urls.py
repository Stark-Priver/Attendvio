"""
URL configuration for attendvio project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/attendance_sessions/', include('attendance_sessions.urls')),
    path('api/attendance_session/', include('attendance_sessions.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
