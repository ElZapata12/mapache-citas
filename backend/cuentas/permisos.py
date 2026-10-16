from rest_framework.permissions import BasePermission

from .models import Usuario


class EsAdmin(BasePermission):
    message = "Solo el administrador puede hacer esto."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == Usuario.Rol.ADMIN


class EsAdminORecepcion(BasePermission):
    message = "Solo administración o recepción pueden hacer esto."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol in (
            Usuario.Rol.ADMIN,
            Usuario.Rol.RECEPCION,
        )