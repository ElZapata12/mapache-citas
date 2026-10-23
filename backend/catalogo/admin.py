from django.contrib import admin

from .models import Barbero, Servicio


@admin.register(Barbero)
class BarberoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "telefono", "activo")
    list_filter = ("activo",)
    search_fields = ("nombre",)


@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ("descripcion", "duracion_min", "costo", "activo")
    list_filter = ("activo",)
    search_fields = ("descripcion",)
