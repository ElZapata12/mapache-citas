from django.contrib import admin
from django.urls import path

from catalogo.views import BarberoListaView, ServicioListaView
from citas.views import (
    CitaDetalleView,
    CitaEstadoView,
    CitaListaCrearView,
    DisponibilidadView,
    ResumenDiaView,
)
from clientes.views import ClienteDetalleView, ClienteListaCrearView
from cuentas.views import LoginView, LogoutView, YoView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Autenticación
    path("api/auth/login/", LoginView.as_view()),
    path("api/auth/logout/", LogoutView.as_view()),
    path("api/auth/yo/", YoView.as_view()),
    # Catálogo
    path("api/barberos/", BarberoListaView.as_view()),
    path("api/servicios/", ServicioListaView.as_view()),
    # Citas
    path("api/citas/", CitaListaCrearView.as_view()),
    path("api/citas/<int:pk>/", CitaDetalleView.as_view()),
    path("api/citas/<int:pk>/estado/", CitaEstadoView.as_view()),
    path("api/disponibilidad/", DisponibilidadView.as_view()),
    # Reportes
    path("api/reportes/dia/", ResumenDiaView.as_view()),
    # Clientes
    path("api/clientes/", ClienteListaCrearView.as_view()),
    path("api/clientes/<int:pk>/", ClienteDetalleView.as_view()),
]
