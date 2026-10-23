from django.db.models import Q
from rest_framework import generics

from cuentas.permisos import EsAdminORecepcion

from .models import Cliente
from .serializers import ClienteSerializer


class ClienteListaCrearView(generics.ListCreateAPIView):
    """GET /api/clientes/?q=texto -> busca por nombre o teléfono.
    POST /api/clientes/ -> registra un cliente (el teléfono no se repite, RN-05)."""

    serializer_class = ClienteSerializer
    permission_classes = [EsAdminORecepcion]

    def get_queryset(self):
        clientes = Cliente.objects.all()
        q = self.request.query_params.get("q", "").strip()
        if q:
            clientes = clientes.filter(Q(nombre__icontains=q) | Q(telefono__contains=q))
        return clientes[:50]


class ClienteDetalleView(generics.RetrieveUpdateAPIView):
    """GET y PUT/PATCH /api/clientes/<id>/"""

    serializer_class = ClienteSerializer
    permission_classes = [EsAdminORecepcion]
    queryset = Cliente.objects.all()
