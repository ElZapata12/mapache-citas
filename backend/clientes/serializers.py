import re

from rest_framework import serializers

from .models import Cliente


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ["id", "nombre", "telefono", "notas", "creado_en"]
        read_only_fields = ["creado_en"]

    def to_internal_value(self, data):
        # Acepta "55 1234 5678" o "55-1234-5678" y guarda solo los dígitos.
        if "telefono" in data and isinstance(data["telefono"], str):
            data = data.copy()
            data["telefono"] = re.sub(r"\D", "", data["telefono"])
        return super().to_internal_value(data)
