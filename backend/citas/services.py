"""Reglas de negocio de las citas (RN-01 a RN-08).

Aquí vive la lógica importante. Las vistas solo reciben la petición, llaman a estas
funciones y devuelven la respuesta. Así las reglas se pueden probar sin HTTP.
"""

import math
from datetime import datetime, time, timedelta

from django.db import IntegrityError, transaction
from django.utils import timezone

from catalogo.models import Barbero, Servicio
from clientes.models import Cliente
from core.excepciones import ReglaDeNegocioError

from .models import Cita, CitaServicio

HORA_APERTURA = time(10, 0)
HORA_CIERRE = time(20, 0)
BLOQUE_MIN = 15
DOMINGO = 6  # datetime.weekday(): lunes=0 ... domingo=6


def duracion_total(servicios):
    """Suma las duraciones y redondea hacia arriba al siguiente bloque de 15 min (RN-02)."""
    minutos = sum(s.duracion_min for s in servicios)
    return math.ceil(minutos / BLOQUE_MIN) * BLOQUE_MIN


def a_fecha_hora(fecha, hora):
    """Une una fecha y una hora en un datetime con la zona horaria de México."""
    return datetime.combine(fecha, hora, tzinfo=timezone.get_current_timezone())


def validar_horario(inicio, fin):
    """RN-03 y RN-04: lunes a sábado, de 10:00 a 20:00, en bloques de 15 min y nunca en el pasado."""
    local_inicio = timezone.localtime(inicio)
    local_fin = timezone.localtime(fin)
    if local_inicio.weekday() == DOMINGO:
        raise ReglaDeNegocioError("FUERA_DE_HORARIO", "Los domingos la barbería está cerrada.")
    if local_inicio.minute % BLOQUE_MIN != 0:
        raise ReglaDeNegocioError("FUERA_DE_HORARIO", "La hora debe ser en bloques de 15 minutos.")
    if local_inicio.time() < HORA_APERTURA or local_fin.date() != local_inicio.date() or local_fin.time() > HORA_CIERRE:
        raise ReglaDeNegocioError("FUERA_DE_HORARIO", "La cita debe quedar entre las 10:00 y las 20:00.")
    if inicio < timezone.now():
        raise ReglaDeNegocioError("FECHA_PASADA", "No se pueden agendar citas en el pasado.")


def buscar_empalme(barbero, inicio, fin, excluir_cita_id=None):
    """RN-01: dos rangos [a, b) y [c, d) se traslapan si a < d y c < b."""
    citas = Cita.objects.filter(barbero=barbero, inicio__lt=fin, fin__gt=inicio).exclude(
        estado=Cita.Estado.CANCELADA
    )
    if excluir_cita_id:
        citas = citas.exclude(pk=excluir_cita_id)
    return citas.first()


def error_de_empalme(barbero, choque):
    de = timezone.localtime(choque.inicio).strftime("%H:%M")
    a = timezone.localtime(choque.fin).strftime("%H:%M")
    return ReglaDeNegocioError(
        "HORARIO_OCUPADO",
        f"{barbero.nombre} ya tiene una cita de {de} a {a}.",
        status_http=409,
    )


def obtener_servicios_activos(servicio_ids):
    ids = set(servicio_ids)
    if not ids:
        raise ReglaDeNegocioError("SIN_SERVICIOS", "Elige al menos un servicio.")
    servicios = list(Servicio.objects.filter(pk__in=ids, activo=True))
    if len(servicios) != len(ids):
        raise ReglaDeNegocioError("SERVICIO_NO_DISPONIBLE", "Uno de los servicios no existe o está inactivo.")
    return servicios


@transaction.atomic
def crear_cita(*, barbero_id, cliente_id, servicio_ids, fecha, hora_inicio, notas=""):
    # Bloquea la fila del barbero hasta que termine la transacción: si otra recepcionista
    # intenta agendar con el mismo barbero al mismo tiempo, espera su turno (CA-10).
    barbero = Barbero.objects.select_for_update().filter(pk=barbero_id).first()
    if barbero is None or not barbero.activo:
        raise ReglaDeNegocioError("BARBERO_NO_DISPONIBLE", "El barbero no existe o está inactivo.")

    cliente = Cliente.objects.filter(pk=cliente_id).first()
    if cliente is None:
        raise ReglaDeNegocioError("CLIENTE_NO_ENCONTRADO", "El cliente no existe.", status_http=404)

    servicios = obtener_servicios_activos(servicio_ids)
    inicio = a_fecha_hora(fecha, hora_inicio)
    fin = inicio + timedelta(minutes=duracion_total(servicios))
    validar_horario(inicio, fin)

    choque = buscar_empalme(barbero, inicio, fin)
    if choque:
        raise error_de_empalme(barbero, choque)

    try:
        cita = Cita.objects.create(barbero=barbero, cliente=cliente, inicio=inicio, fin=fin, notas=notas)
    except IntegrityError:
        # Segunda defensa: la restricción de PostgreSQL detectó un empalme.
        raise ReglaDeNegocioError("HORARIO_OCUPADO", "Ese horario se acaba de ocupar.", status_http=409)

    CitaServicio.objects.bulk_create(
        [
            CitaServicio(cita=cita, servicio=s, costo_cobrado=s.costo, duracion_min=s.duracion_min)
            for s in servicios
        ]
    )
    return cita


def horarios_disponibles(*, barbero_id, servicio_ids, fecha):
    """Devuelve las horas de inicio ("HH:MM") donde caben todos los servicios sin empalmes."""
    barbero = Barbero.objects.filter(pk=barbero_id, activo=True).first()
    if barbero is None:
        raise ReglaDeNegocioError("BARBERO_NO_DISPONIBLE", "El barbero no existe o está inactivo.")
    servicios = obtener_servicios_activos(servicio_ids)
    duracion = timedelta(minutes=duracion_total(servicios))

    apertura = a_fecha_hora(fecha, HORA_APERTURA)
    cierre = a_fecha_hora(fecha, HORA_CIERRE)
    if apertura.weekday() == DOMINGO:
        return []

    ocupadas = list(
        Cita.objects.filter(barbero=barbero, inicio__lt=cierre, fin__gt=apertura)
        .exclude(estado=Cita.Estado.CANCELADA)
        .values_list("inicio", "fin")
    )
    ahora = timezone.now()
    libres = []
    inicio = apertura
    while inicio + duracion <= cierre:
        fin = inicio + duracion
        choca = any(i < fin and inicio < f for i, f in ocupadas)
        if not choca and inicio >= ahora:
            libres.append(timezone.localtime(inicio).strftime("%H:%M"))
        inicio += timedelta(minutes=BLOQUE_MIN)
    return libres


TRANSICIONES_VALIDAS = {
    Cita.Estado.PROGRAMADA: {Cita.Estado.ATENDIDA, Cita.Estado.CANCELADA, Cita.Estado.NO_ASISTIO},
}


def cambiar_estado(cita, nuevo_estado):
    """RN-09: solo una cita programada puede pasar a atendida, cancelada o no asistió."""
    permitidos = TRANSICIONES_VALIDAS.get(cita.estado, set())
    if nuevo_estado not in permitidos:
        raise ReglaDeNegocioError(
            "TRANSICION_INVALIDA",
            f"Una cita {cita.get_estado_display().lower()} no puede cambiar a {nuevo_estado}.",
        )
    cita.estado = nuevo_estado
    cita.save(update_fields=["estado"])
    return cita
