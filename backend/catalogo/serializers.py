from rest_framework import serializers

from .models import Barbero, Servicio, Sucursal


class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = ["id", "nombre", "direccion", "telefono", "activa"]


class BarberoSerializer(serializers.ModelSerializer):
    sucursal_nombre = serializers.CharField(source="sucursal.nombre", read_only=True)

    class Meta:
        model = Barbero
        fields = ["id", "nombre", "telefono", "activo", "sucursal", "sucursal_nombre"]


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ["id", "descripcion", "costo", "duracion_min", "activo"]


#### 2. backend/catalogo/views.py

*Reemplaza todo* el contenido de backend/catalogo/views.py con esto:

python
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from citas import services
from cuentas.models import Usuario
from cuentas.permisos import EsAdmin

from .models import Barbero, Servicio, Sucursal
from .serializers import BarberoSerializer, ServicioSerializer, SucursalSerializer


class BarberoListaView(generics.ListAPIView):
    """GET /api/barberos/ -> barberos activos de sucursales activas (RN-08, RN-12).
    Admin: todos, o solo los de ?sucursal=ID. Recepción y barbero: solo los de su sucursal (RN-13)."""

    serializer_class = BarberoSerializer

    def get_queryset(self):
        barberos = Barbero.objects.filter(activo=True, sucursal__activa=True).select_related("sucursal")
        usuario = self.request.user
        if usuario.rol != Usuario.Rol.ADMIN:
            return barberos.filter(sucursal_id=usuario.sucursal_efectiva_id)
        sucursal = self.request.query_params.get("sucursal", "")
        return barberos.filter(sucursal_id=sucursal) if sucursal.isdigit() else barberos


class ServicioListaView(generics.ListAPIView):
    """GET /api/servicios/ -> servicios activos (RN-08)."""

    serializer_class = ServicioSerializer
    queryset = Servicio.objects.filter(activo=True)


class SucursalListaCrearView(generics.ListCreateAPIView):
    """GET /api/sucursales/ -> admin: las activas (o todas con ?incluir_inactivas=1); los demás: solo la suya.
    POST /api/sucursales/ -> solo admin."""

    serializer_class = SucursalSerializer

    def get_permissions(self):
        # Una sola vista, permisos distintos según el método.
        return [EsAdmin()] if self.request.method == "POST" else [IsAuthenticated()]

    def get_queryset(self):
        usuario = self.request.user
        if usuario.rol != Usuario.Rol.ADMIN:
            return Sucursal.objects.filter(pk=usuario.sucursal_efectiva_id)
        sucursales = Sucursal.objects.all()
        if self.request.query_params.get("incluir_inactivas") != "1":
            sucursales = sucursales.filter(activa=True)
        return sucursales


class SucursalDetalleView(generics.RetrieveUpdateAPIView):
    """GET y PATCH /api/sucursales/<id>/ (solo admin). No se desactiva con citas por venir (RN-12)."""

    serializer_class = SucursalSerializer
    permission_classes = [EsAdmin]
    queryset = Sucursal.objects.all()

    def perform_update(self, serializer):
        if serializer.instance.activa and serializer.validated_data.get("activa") is False:
            services.verificar_que_se_puede_desactivar(serializer.instance)
        serializer.save()