"""Carga datos de prueba para desarrollar y para la demo.

Uso:  python manage.py cargar_demo
Se puede correr varias veces: no duplica lo que ya existe.
"""

from decimal import Decimal

from django.core.management.base import BaseCommand

from catalogo.models import Barbero, Servicio

BARBEROS = ["Luis Hernández", "Diego Ramírez", "Toño Castillo"]
SERVICIOS = [
    ("Corte clásico", "150", 30),
    ("Arreglo de barba", "120", 30),
    ("Corte + barba", "250", 60),
    ("Afeitado con toalla caliente", "180", 45),
    ("Fade / diseño", "200", 45),
    ("Corte infantil", "120", 30),
]


class Command(BaseCommand):
    help = "Crea barberos y servicios de prueba."

    def handle(self, *args, **options):
        for nombre in BARBEROS:
            Barbero.objects.get_or_create(nombre=nombre)
        for descripcion, costo, minutos in SERVICIOS:
            Servicio.objects.get_or_create(
                descripcion=descripcion, defaults={"costo": Decimal(costo), "duracion_min": minutos}
            )
        self.stdout.write(self.style.SUCCESS("Barberos y servicios de prueba listos."))
