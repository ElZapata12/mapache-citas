from django.contrib import admin
from django.urls import path

from clientes.views import ClienteDetalleView, ClienteListaCrearView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Clientes
    path("api/clientes/", ClienteListaCrearView.as_view()),
    path("api/clientes/<int:pk>/", ClienteDetalleView.as_view()),
]
