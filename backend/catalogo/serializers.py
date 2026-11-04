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
