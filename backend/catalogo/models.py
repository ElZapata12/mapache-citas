from django.core.validators import MinValueValidator, RegexValidator
from django.db import models

telefono_valido = RegexValidator(r"^\d{10}$", "El teléfono debe tener exactamente 10 dígitos.")


def multiplo_de_15(valor):
    from django.core.exceptions import ValidationError

    if valor % 15 != 0:
        raise ValidationError("La duración debe ser múltiplo de 15 minutos.")


class Barbero(models.Model):
    nombre = models.CharField(max_length=80)
    telefono = models.CharField(max_length=10, blank=True, validators=[telefono_valido])
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Servicio(models.Model):
    descripcion = models.CharField(max_length=120)
    costo = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    duracion_min = models.PositiveSmallIntegerField(validators=[multiplo_de_15])
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ["descripcion"]

    def __str__(self):
        return f"{self.descripcion} ({self.duracion_min} min, ${self.costo})"
