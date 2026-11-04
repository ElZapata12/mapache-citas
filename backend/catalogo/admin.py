from django.contrib import admin

from .models import Barbero, Servicio, Sucursal


@admin.register(Sucursal)
class SucursalAdmin(admin.ModelAdmin):
    list_display = ("nombre", "direccion", "telefono", "activa")
    list_filter = ("activa",)
    search_fields = ("nombre",)


@admin.register(Barbero)
class BarberoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "sucursal", "telefono", "activo")
    list_filter = ("activo", "sucursal")
    search_fields = ("nombre",)


@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ("descripcion", "duracion_min", "costo", "activo")
    list_filter = ("activo",)
    search_fields = ("descripcion",)
