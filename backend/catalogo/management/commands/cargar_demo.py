"""Carga datos de prueba para desarrollar y para la demo.

Uso:  python manage.py cargar_demo
      python manage.py cargar_demo --con-citas   (agrega citas de ejemplo para el próximo día hábil)

Se puede correr varias veces: no duplica lo que ya existe.
"""

from datetime import time, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from catalogo.models import Barbero, Servicio, Sucursal
from citas import services
from citas.models import Cita
from clientes.models import Cliente
from core.excepciones import ReglaDeNegocioError
from cuentas.models import Usuario

CLAVE_DEMO = "mapache123"

# (nombre, dirección, teléfono). La primera es la que crea la migración de datos.
SUCURSALES = [
    ("Sucursal Principal", "Av. Juárez 120, Centro", "5511223344"),
    ("Sucursal Norte", "Calle 5 #45, Col. Industrial", "5599887766"),
]
# (nombre, índice de su sucursal en SUCURSALES)
BARBEROS = [("Luis Hernández", 0), ("Diego Ramírez", 0), ("Toño Castillo", 1), ("Mario Vega", 1)]
SERVICIOS = [
    ("Corte clásico", "150", 30),
    ("Arreglo de barba", "120", 30),
    ("Corte + barba", "250", 60),
    ("Afeitado con toalla caliente", "180", 45),
    ("Fade / diseño", "200", 45),
    ("Corte infantil", "120", 30),
]
CLIENTES = [
    ("Carlos Méndez", "5512345678"),
    ("Jorge Salinas", "5523456789"),
    ("Andrés Pineda", "5534567890"),
    ("Arturo Beltrán", "5587654321"),
    ("Mateo Ruiz", "5567890123"),
]
# (barbero, cliente, servicios, hora) de las citas de ejemplo
CITAS = [
    (0, 0, ["Corte clásico"], time(10, 0)),
    (0, 3, ["Corte clásico", "Arreglo de barba"], time(11, 0)),
    (1, 1, ["Corte + barba"], time(10, 30)),
    (1, 2, ["Fade / diseño"], time(12, 0)),
    (2, 4, ["Corte infantil"], time(16, 0)),
    (3, 1, ["Corte clásico"], time(11, 0)),
]


def proximo_dia_habil():
    """Mañana, o el lunes si mañana es domingo (la barbería cierra los domingos)."""
    dia = timezone.localdate() + timedelta(days=1)
    return dia + timedelta(days=1) if dia.weekday() == 6 else dia


class Command(BaseCommand):
    help = "Crea barberos, servicios, clientes y usuarios de prueba."

    def add_arguments(self, parser):
        parser.add_argument("--con-citas", action="store_true", help="Agrega citas de ejemplo para el próximo día hábil.")

    def handle(self, *args, **options):
        sucursales = [
            Sucursal.objects.get_or_create(nombre=n, defaults={"direccion": d, "telefono": t})[0]
            for n, d, t in SUCURSALES
        ]
        barberos = [
            Barbero.objects.get_or_create(nombre=n, defaults={"sucursal": sucursales[i]})[0] for n, i in BARBEROS
        ]
        for descripcion, costo, minutos in SERVICIOS:
            Servicio.objects.get_or_create(
                descripcion=descripcion, defaults={"costo": Decimal(costo), "duracion_min": minutos}
            )
        clientes = [Cliente.objects.get_or_create(telefono=t, defaults={"nombre": n})[0] for n, t in CLIENTES]

        usuarios = [
            ("admin", Usuario.Rol.ADMIN, None, None, True),
            ("recepcion", Usuario.Rol.RECEPCION, None, sucursales[0], False),
            ("recepcion2", Usuario.Rol.RECEPCION, None, sucursales[1], False),
            ("luis", Usuario.Rol.BARBERO, barberos[0], None, False),
        ]
        for username, rol, barbero, sucursal, es_staff in usuarios:
            usuario, creado = Usuario.objects.get_or_create(
                username=username,
                defaults={"rol": rol, "barbero": barbero, "sucursal": sucursal, "first_name": username.capitalize()},
            )
            if creado:
                usuario.set_password(CLAVE_DEMO)
                usuario.is_staff = es_staff
                usuario.is_superuser = es_staff
                usuario.save()

        self.stdout.write(
            self.style.SUCCESS(f"Datos de prueba listos. Usuarios: admin, recepcion (Principal), recepcion2 (Norte), luis · clave: {CLAVE_DEMO}")
        )

        if options["con_citas"]:
            fecha = proximo_dia_habil()
            creadas = 0
            for i_barbero, i_cliente, nombres, hora in CITAS:
                ids = list(Servicio.objects.filter(descripcion__in=nombres).values_list("id", flat=True))
                try:
                    services.crear_cita(
                        barbero_id=barberos[i_barbero].id,
                        cliente_id=clientes[i_cliente].id,
                        servicio_ids=ids,
                        fecha=fecha,
                        hora_inicio=hora,
                    )
                    creadas += 1
                except ReglaDeNegocioError:
                    pass  # ya existía esa cita (el comando se puede repetir)
            total = Cita.objects.filter(inicio__date=fecha).count()
            self.stdout.write(self.style.SUCCESS(f"Citas de ejemplo para {fecha}: {creadas} nuevas ({total} ese día)."))
