"""Pruebas de las reglas de negocio de las citas.

Cada prueba corresponde a un criterio de aceptación (CA) de la spec S-04.
Correr con:  pytest
"""

from datetime import date, time, timedelta
from decimal import Decimal

import pytest
from django.utils import timezone

from catalogo.models import Barbero, Servicio
from citas import services
from citas.models import Cita
from clientes.models import Cliente
from core.excepciones import ReglaDeNegocioError

pytestmark = pytest.mark.django_db


def proximo_lunes():
    hoy = timezone.localdate()
    return hoy + timedelta(days=(7 - hoy.weekday()) or 7)


@pytest.fixture
def datos():
    return {
        "luis": Barbero.objects.create(nombre="Luis Hernández"),
        "toño": Barbero.objects.create(nombre="Toño Castillo"),
        "beto": Barbero.objects.create(nombre="Beto Sánchez", activo=False),
        "cliente": Cliente.objects.create(nombre="Arturo Beltrán", telefono="5587654321"),
        "corte": Servicio.objects.create(descripcion="Corte clásico", costo=Decimal("150"), duracion_min=30),
        "barba": Servicio.objects.create(descripcion="Arreglo de barba", costo=Decimal("120"), duracion_min=30),
        "tinte": Servicio.objects.create(descripcion="Tinte", costo=Decimal("220"), duracion_min=45, activo=False),
    }


def agendar(d, barbero="luis", servicios=("corte",), hora=time(14, 0), fecha=None):
    return services.crear_cita(
        barbero_id=d[barbero].id,
        cliente_id=d["cliente"].id,
        servicio_ids=[d[s].id for s in servicios],
        fecha=fecha or proximo_lunes(),
        hora_inicio=hora,
    )


def test_ca01_varios_servicios_suman_duracion_y_costo(datos):
    cita = agendar(datos, servicios=("corte", "barba"))
    assert timezone.localtime(cita.fin).time() == time(15, 0)
    assert cita.total == Decimal("270")
    assert cita.estado == Cita.Estado.PROGRAMADA


def test_ca02_empalme_responde_409(datos):
    agendar(datos, hora=time(13, 0))
    with pytest.raises(ReglaDeNegocioError) as error:
        agendar(datos, hora=time(13, 15))
    assert error.value.codigo == "HORARIO_OCUPADO"
    assert error.value.status_http == 409


def test_ca03_bordes_que_se_tocan_si_se_permiten(datos):
    agendar(datos, hora=time(13, 0))
    agendar(datos, hora=time(13, 30))
    assert Cita.objects.count() == 2


def test_ca04_cita_cancelada_libera_el_horario(datos):
    cita = agendar(datos, hora=time(14, 0))
    services.cambiar_estado(cita, Cita.Estado.CANCELADA)
    agendar(datos, hora=time(14, 0))


def test_ca05_el_empalme_es_por_barbero(datos):
    agendar(datos, barbero="luis", hora=time(13, 0))
    agendar(datos, barbero="toño", hora=time(13, 0))


def test_ca06_fuera_de_horario_y_domingo(datos):
    with pytest.raises(ReglaDeNegocioError, match="10:00 y las 20:00"):
        agendar(datos, servicios=("corte", "barba"), hora=time(19, 30))
    domingo = proximo_lunes() + timedelta(days=6)
    with pytest.raises(ReglaDeNegocioError, match="domingos"):
        agendar(datos, fecha=domingo)


def test_ca07_no_se_agenda_en_el_pasado(datos):
    with pytest.raises(ReglaDeNegocioError) as error:
        agendar(datos, fecha=date(2020, 1, 6))
    assert error.value.codigo == "FECHA_PASADA"


def test_ca08_barbero_o_servicio_inactivo(datos):
    with pytest.raises(ReglaDeNegocioError):
        agendar(datos, barbero="beto")
    with pytest.raises(ReglaDeNegocioError):
        agendar(datos, servicios=("tinte",))


def test_ca09_el_precio_se_congela_al_agendar(datos):
    cita = agendar(datos)
    datos["corte"].costo = Decimal("180")
    datos["corte"].save()
    cita.refresh_from_db()
    assert cita.total == Decimal("150")


def test_disponibilidad_quita_horas_ocupadas(datos):
    agendar(datos, hora=time(10, 0))
    libres = services.horarios_disponibles(
        barbero_id=datos["luis"].id, servicio_ids=[datos["corte"].id], fecha=proximo_lunes()
    )
    assert "10:00" not in libres
    assert "10:15" not in libres
    assert "10:30" in libres
    assert libres[-1] == "19:30"


def test_solo_programadas_cambian_de_estado(datos):
    cita = agendar(datos)
    services.cambiar_estado(cita, Cita.Estado.ATENDIDA)
    with pytest.raises(ReglaDeNegocioError) as error:
        services.cambiar_estado(cita, Cita.Estado.CANCELADA)
    assert error.value.codigo == "TRANSICION_INVALIDA"


def test_duracion_se_redondea_a_bloques_de_15(datos):
    extra = Servicio.objects.create(descripcion="Cejas", costo=Decimal("50"), duracion_min=15)
    assert services.duracion_total([datos["corte"], extra]) == 45
    assert services.duracion_total([datos["corte"]]) == 30


@pytest.mark.django_db(transaction=True)
def test_ca10_dos_recepcionistas_a_la_vez_solo_una_gana(datos):
    """Dos personas agendan al mismo barbero a la misma hora en el mismo instante."""
    import threading

    from django.db import connection

    resultados = []

    def intentar():
        try:
            agendar(datos, hora=time(15, 0))
            resultados.append("ok")
        except ReglaDeNegocioError as error:
            resultados.append(error.codigo)
        finally:
            connection.close()

    hilos = [threading.Thread(target=intentar) for _ in range(4)]
    for hilo in hilos:
        hilo.start()
    for hilo in hilos:
        hilo.join()

    assert sorted(resultados) == ["HORARIO_OCUPADO"] * 3 + ["ok"]
    assert Cita.objects.count() == 1
