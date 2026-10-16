from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Agrega nuestros campos a las pantallas de usuario que ya trae Django.
    fieldsets = UserAdmin.fieldsets + (("MapacheCitas", {"fields": ("rol",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("MapacheCitas", {"fields": ("rol",)}),)
    list_display = ("username", "first_name", "rol", "is_active")
    list_filter = ("rol", "is_active")