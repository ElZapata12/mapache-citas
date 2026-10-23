from django.contrib.postgres.constraints import ExclusionConstraint
from django.contrib.postgres.fields import DateTimeRangeField, RangeBoundary, RangeOperators
from django.db import models
from django.db.models import F, Func, Q

from catalogo.models import Barbero, Servicio
from clientes.models import Cliente


class TsTzRange(Func):
    """Convierte (inicio, fin) en un rango de tiempo de PostgreSQL: [inicio, fin)"""

    function = "TSTZRANGE"
    output_field = DateTimeRangeField()


class Cita(models.Model):
    class Estado(models.TextChoices):
        PROGRAMADA = "programada", "Programada"
        ATENDIDA = "atendida", "Atendida"
        CANCELADA = "cancelada", "Cancelada"
        NO_ASISTIO = "no_asistio", "No asistió"

    barbero = models.ForeignKey(Barbero, on_delete=models.PROTECT, related_name="citas")
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name="citas")
    inicio = models.DateTimeField()
    fin = models.DateTimeField()
    estado = models.CharField(max_length=12, choices=Estado.choices, default=Estado.PROGRAMADA)
    notas = models.TextField(blank=True)
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["inicio"]
        indexes = [models.Index(fields=["barbero", "inicio"])]
        constraints = [
            models.CheckConstraint(condition=Q(fin__gt=F("inicio")), name="cita_fin_despues_de_inicio"),
            # Segunda defensa contra empalmes (RN-01): PostgreSQL rechaza dos citas
            # no canceladas del mismo barbero cuyos rangos [inicio, fin) se traslapen.
            ExclusionConstraint(
                name="cita_sin_empalmes_por_barbero",
                expressions=[
                    (TsTzRange("inicio", "fin", RangeBoundary()), RangeOperators.OVERLAPS),
                    ("barbero", RangeOperators.EQUAL),
                ],
                condition=~Q(estado="cancelada"),
            ),
        ]

    def _str_(self):
        return f"{self.cliente.nombre} con {self.barbero.nombre} el {self.inicio:%d/%m %H:%M}"

    @property
    def total(self):
        return sum(cs.costo_cobrado for cs in self.servicios.all())


class CitaServicio(models.Model):
    """Un servicio dentro de una cita. Guarda una copia del costo y la duración
    del momento en que se agendó (RN-06): si después cambia el precio, la cita no cambia."""

    cita = models.ForeignKey(Cita, on_delete=models.CASCADE, related_name="servicios")
    servicio = models.ForeignKey(Servicio, on_delete=models.PROTECT)
    costo_cobrado = models.DecimalField(max_digits=8, decimal_places=2)
    duracion_min = models.PositiveSmallIntegerField()

    def _str_(self):
        return f"{self.servicio.descripcion} (${self.costo_cobrado})"