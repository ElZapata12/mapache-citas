from django.contrib import admin
from django.urls import path

from catalogo.views import BarberoListaView, ServicioListaView
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
    # Clientes
    path("api/clientes/", ClienteListaCrearView.as_view()),
    path("api/clientes/<int:pk>/", ClienteDetalleView.as_view()),
]
