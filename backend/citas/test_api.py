"""Pruebas de la API de citas: prueban la petición HTTP completa (URL, permisos, JSON, errores)."""

from datetime import timedelta
from decimal import Decimal

import pytest
from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework.test import APIClient

from catalogo.models import Barbero, Servicio
from citas.models import Cita
from clientes.models import Cliente
from cuentas.models import Usuario

pytestmark = pytest.mark.django_db


def proximo_lunes():
    hoy = timezone.localdate()
    return hoy + timedelta(days=(7 - hoy.weekday()) or 7)


@pytest.fixture
def escenario():
    luis = Barbero.objects.create(nombre="Luis Hernández")
    corte = Servicio.objects.create(descripcion="Corte clásico", costo=Decimal("150"), duracion_min=30)
    barba = Servicio.objects.create(descripcion="Arreglo de barba", costo=Decimal("120"), duracion_min=30)
    cliente = Cliente.objects.create(nombre="Arturo Beltrán", telefono="5587654321")
    Usuario.objects.create_user("ana", password="clave-segura-123", rol=Usuario.Rol.RECEPCION)
    Usuario.objects.create_user("jesus", password="clave-segura-123", rol=Usuario.Rol.ADMIN)
    Usuario.objects.create_user("luis", password="clave-segura-123", rol=Usuario.Rol.BARBERO, barbero=luis)
    return {"luis": luis, "corte": corte, "barba": barba, "cliente": cliente}


def cliente_api(username):
    api = APIClient()
    respuesta = api.post("/api/auth/login/", {"username": username, "password": "clave-segura-123"}, format="json")
    assert respuesta.status_code == 200, respuesta.data
    api.credentials(HTTP_AUTHORIZATION=f"Token {respuesta.data['token']}")
    return api


def cuerpo(e, hora="14:00"):
    return {
        "barbero": e["luis"].id,
        "cliente": e["cliente"].id,
        "servicios": [e["corte"].id, e["barba"].id],
        "fecha": proximo_lunes().isoformat(),
        "hora_inicio": hora,
    }


def test_sin_token_responde_401():
    respuesta = APIClient().get("/api/citas/")
    assert respuesta.status_code == 401
    assert respuesta.data["error"]["codigo"] == "NO_AUTENTICADO"


def test_crear_cita_y_empalme(escenario):
    api = cliente_api("ana")
    creada = api.post("/api/citas/", cuerpo(escenario), format="json")
    assert creada.status_code == 201, creada.data
    assert creada.data["total"] == "270.00"
    assert len(creada.data["servicios"]) == 2

    choque = api.post("/api/citas/", cuerpo(escenario, "14:30"), format="json")
    assert choque.status_code == 409
    assert choque.data["error"]["codigo"] == "HORARIO_OCUPADO"


def test_validacion_de_forma_responde_400(escenario):
    api = cliente_api("ana")
    datos = cuerpo(escenario)
    datos["servicios"] = []
    respuesta = api.post("/api/citas/", datos, format="json")
    assert respuesta.status_code == 400
    assert respuesta.data["error"]["codigo"] == "VALIDACION"
    assert "servicios" in respuesta.data["error"]["campos"]


def test_barbero_solo_ve_sus_citas_y_no_agenda(escenario):
    cliente_api("ana").post("/api/citas/", cuerpo(escenario), format="json")
    otro = Barbero.objects.create(nombre="Toño Castillo")
    Usuario.objects.create_user("tono", password="clave-segura-123", rol=Usuario.Rol.BARBERO, barbero=otro)

    luis = cliente_api("luis")
    assert len(luis.get(f"/api/citas/?fecha={proximo_lunes()}").data) == 1
    assert len(cliente_api("tono").get(f"/api/citas/?fecha={proximo_lunes()}").data) == 0
    assert luis.post("/api/citas/", cuerpo(escenario, "16:00"), format="json").status_code == 403


def test_disponibilidad(escenario):
    api = cliente_api("ana")
    api.post("/api/citas/", cuerpo(escenario, "10:00"), format="json")
    libres = api.get(
        f"/api/disponibilidad/?barbero={escenario['luis'].id}&fecha={proximo_lunes()}"
        f"&servicios={escenario['corte'].id}"
    ).data["horarios"]
    assert libres[0] == "11:00"


def test_postgres_rechaza_empalmes_aunque_se_salten_el_servicio(escenario):
    inicio = timezone.now() + timedelta(days=1)
    Cita.objects.create(barbero=escenario["luis"], cliente=escenario["cliente"], inicio=inicio, fin=inicio + timedelta(minutes=30))
    with pytest.raises(IntegrityError), transaction.atomic():
        Cita.objects.create(
            barbero=escenario["luis"],
            cliente=escenario["cliente"],
            inicio=inicio + timedelta(minutes=15),
            fin=inicio + timedelta(minutes=45),
        )


def test_filtros_mal_escritos_responden_400_y_no_500(escenario):
    api = cliente_api("ana")
    for consulta in ("fecha=abc", "barbero=abc", "fecha=2026-13-45"):
        respuesta = api.get(f"/api/citas/?{consulta}")
        assert respuesta.status_code == 400, consulta
        assert respuesta.data["error"]["codigo"] == "VALIDACION"
