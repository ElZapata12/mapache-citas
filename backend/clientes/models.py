from django.db import models

from catalogo.models import telefono_valido


class Cliente(models.Model):
    nombre = models.CharField(max_length=80)
    telefono = models.CharField(max_length=10, unique=True, validators=[telefono_valido])
    notas = models.TextField(blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["nombre"]

    def __str__(self):
        return f"{self.nombre} ({self.telefono})"
