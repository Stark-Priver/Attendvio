"""
Custom permissions for role-based access control.
"""
from rest_framework import permissions


class IsTeacher(permissions.BasePermission):
    """Permission class to check if user is a teacher."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_teacher()


class IsStudent(permissions.BasePermission):
    """Permission class to check if user is a student."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_student()


class IsTeacherOrReadOnly(permissions.BasePermission):
    """Allow teachers to modify, others to read."""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.is_teacher()
