from rest_framework import permissions

class IsAdminGroupOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated

        user = request.user
        if not user or not user.is_authenticated:
            return False
        return user.groups.filter(name='Administrador').exists() or user.is_superuser