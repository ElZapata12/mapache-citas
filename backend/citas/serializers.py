from rest_framework import serializers

from .models import Cita, CitaServicio


class CitaCrearSerializer(serializers.Serializer):
    """Valida la FORMA de los datos de entrada. Las reglas del negocio las valida services.py."""

    barbero = serializers.IntegerField()
    cliente = serializers.IntegerField()
    servicios = serializers.ListField(child=serializers.IntegerField(), min_length=1)
    fecha = serializers.DateField()
    hora_inicio = serializers.TimeField(format="%H:%M")
    notas = serializers.CharField(required=False, allow_blank=True, max_length=250)


class CitaServicioSerializer(serializers.ModelSerializer):
    descripcion = serializers.CharField(source="servicio.descripcion", read_only=True)

    class Meta:
        model = CitaServicio
        fields = ["servicio", "descripcion", "costo_cobrado", "duracion_min"]


class CitaSerializer(serializers.ModelSerializer):
    """Forma de salida de una cita."""

    barbero_nombre = serializers.CharField(source="barbero.nombre", read_only=True)
    cliente_nombre = serializers.CharField(source="cliente.nombre", read_only=True)
    cliente_telefono = serializers.CharField(source="cliente.telefono", read_only=True)
    servicios = CitaServicioSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=9, decimal_places=2, read_only=True)

    class Meta:
        model = Cita
        fields = [
            "id",
            "barbero",
            "barbero_nombre",
            "cliente",
            "cliente_nombre",
            "cliente_telefono",
            "inicio",
            "fin",
            "estado",
            "notas",
            "servicios",
            "total",
        ]


class DisponibilidadSerializer(serializers.Serializer):
    barbero = serializers.IntegerField()
    fecha = serializers.DateField()
    servicios = serializers.ListField(child=serializers.IntegerField(), min_length=1)


class FiltroCitasSerializer(serializers.Serializer):
    """Valida los filtros opcionales de GET /api/citas/ (fecha y barbero)."""

    fecha = serializers.DateField(required=False)
    barbero = serializers.IntegerField(required=False)


class CambiarEstadoSerializer(serializers.Serializer):
    estado = serializers.ChoiceField(choices=Cita.Estado.choices)


class FechaSerializer(serializers.Serializer):
    """Valida la fecha opcional de los reportes (AAAA-MM-DD)."""

    fecha = serializers.DateField(required=False)
