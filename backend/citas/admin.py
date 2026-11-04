from django.contrib import admin

from .models import Cita, CitaServicio


class CitaServicioInline(admin.TabularInline):
    model = CitaServicio
    extra = 0


@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ("inicio", "fin", "sucursal", "barbero", "cliente", "estado")
    list_filter = ("estado", "sucursal", "barbero")
    date_hierarchy = "inicio"
    inlines = [CitaServicioInline]
