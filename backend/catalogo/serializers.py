from rest_framework import serializers

from .models import Barbero, Servicio


class BarberoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barbero
        fields = ["id", "nombre", "telefono", "activo"]


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ["id", "descripcion", "costo", "duracion_min", "activo"]
