from rest_framework import generics

from .models import Barbero, Servicio
from .serializers import BarberoSerializer, ServicioSerializer


class BarberoListaView(generics.ListAPIView):
    """GET /api/barberos/ -> barberos activos (los únicos que se pueden agendar, RN-08)."""

    serializer_class = BarberoSerializer
    queryset = Barbero.objects.filter(activo=True)


class ServicioListaView(generics.ListAPIView):
    """GET /api/servicios/ -> servicios activos (RN-08)."""

    serializer_class = ServicioSerializer
    queryset = Servicio.objects.filter(activo=True)
