"""Pruebas de las sucursales (S-09): modelo, API y reglas RN-11 a RN-13."""

from datetime import time, timedelta
from decimal import Decimal

import pytest
from django.db import IntegrityError, transaction
from django.db.models import ProtectedError
from django.utils import timezone
from rest_framework.test import APIClient

from catalogo.models import Barbero, Servicio, Sucursal
from citas import services
from clientes.models import Cliente
from cuentas.models import Usuario

pytestmark = pytest.mark.django_db


def api_de(username):
    api = APIClient()
    r = api.post("/api/auth/login/", {"username": username, "password": "clave-segura-123"}, format="json")
    api.credentials(HTTP_AUTHORIZATION=f"Token {r.data['token']}")
    return api


@pytest.fixture
def mundo():
    centro = Sucursal.objects.create(nombre="Centro")
    norte = Sucursal.objects.create(nombre="Norte")
    Usuario.objects.create_user("jesus", password="clave-segura-123", rol=Usuario.Rol.ADMIN)
    Usuario.objects.create_user("ana", password="clave-segura-123", rol=Usuario.Rol.RECEPCION, sucursal=centro)
    return {"centro": centro, "norte": norte}


# ---------- Modelo ----------


def test_el_nombre_de_la_sucursal_es_unico():
    Sucursal.objects.create(nombre="Centro")
    with pytest.raises(IntegrityError), transaction.atomic():
        Sucursal.objects.create(nombre="Centro")


def test_un_barbero_requiere_sucursal():
    with pytest.raises(IntegrityError), transaction.atomic():
        Barbero.objects.create(nombre="Sin sucursal")


def test_no_se_borra_una_sucursal_con_barberos():
    centro = Sucursal.objects.create(nombre="Centro")
    Barbero.objects.create(nombre="Luis", sucursal=centro)
    with pytest.raises(ProtectedError):
        centro.delete()


def test_la_sucursal_efectiva_depende_del_rol():
    centro = Sucursal.objects.create(nombre="Centro")
    luis = Barbero.objects.create(nombre="Luis", sucursal=centro)
    admin = Usuario.objects.create_user("admin", password="x", rol=Usuario.Rol.ADMIN)
    barbero = Usuario.objects.create_user("luis", password="x", rol=Usuario.Rol.BARBERO, barbero=luis)
    recepcion = Usuario.objects.create_user("ana", password="x", rol=Usuario.Rol.RECEPCION, sucursal=centro)
    assert admin.sucursal_efectiva_id is None  # todas
    assert barbero.sucursal_efectiva_id == centro.id
    assert recepcion.sucursal_efectiva_id == centro.id


# ---------- API ----------


def test_admin_crea_sucursal_y_el_nombre_no_se_repite(mundo):
    api = api_de("jesus")
    assert api.post("/api/sucursales/", {"nombre": "Sur"}, format="json").status_code == 201
    repetida = api.post("/api/sucursales/", {"nombre": "Sur"}, format="json")
    assert repetida.status_code == 400
    assert repetida.data["error"]["codigo"] == "VALIDACION"


def test_recepcion_no_crea_ni_edita(mundo):
    api = api_de("ana")
    assert api.post("/api/sucursales/", {"nombre": "Sur"}, format="json").status_code == 403
    r = api.patch(f"/api/sucursales/{mundo['centro'].id}/", {"activa": False}, format="json")
    assert r.status_code == 403


def test_recepcion_solo_ve_su_sucursal(mundo):
    assert [s["nombre"] for s in api_de("ana").get("/api/sucursales/").data] == ["Centro"]


def test_admin_ve_activas_y_con_la_bandera_tambien_las_inactivas(mundo):
    mundo["norte"].activa = False
    mundo["norte"].save()
    api = api_de("jesus")
    assert [s["nombre"] for s in api.get("/api/sucursales/").data] == ["Centro"]
    assert len(api.get("/api/sucursales/?incluir_inactivas=1").data) == 2


def test_no_se_desactiva_con_citas_por_venir(mundo):
    luis = Barbero.objects.create(nombre="Luis", sucursal=mundo["centro"])
    corte = Servicio.objects.create(descripcion="Corte", costo=Decimal("150"), duracion_min=30)
    cliente = Cliente.objects.create(nombre="Arturo", telefono="5587654321")
    hoy = timezone.localdate()
    lunes = hoy + timedelta(days=(7 - hoy.weekday()) or 7)
    services.crear_cita(
        barbero_id=luis.id, cliente_id=cliente.id, servicio_ids=[corte.id], fecha=lunes, hora_inicio=time(14, 0)
    )
    r = api_de("jesus").patch(f"/api/sucursales/{mundo['centro'].id}/", {"activa": False}, format="json")
    assert r.status_code == 409
    assert r.data["error"]["codigo"] == "SUCURSAL_CON_CITAS"


def test_se_desactiva_una_sucursal_sin_citas(mundo):
    r = api_de("jesus").patch(f"/api/sucursales/{mundo['norte'].id}/", {"activa": False}, format="json")
    assert r.status_code == 200
    assert r.data["activa"] is False


def test_una_sucursal_inactiva_no_ofrece_barberos(mundo):
    Barbero.objects.create(nombre="Pepe", sucursal=mundo["norte"])
    api_de("jesus").patch(f"/api/sucursales/{mundo['norte'].id}/", {"activa": False}, format="json")
    assert api_de("jesus").get("/api/barberos/").data == []


def test_barberos_visibles_por_rol(mundo):
    Barbero.objects.create(nombre="Luis", sucursal=mundo["centro"])
    Barbero.objects.create(nombre="Pepe", sucursal=mundo["norte"])
    assert len(api_de("ana").get("/api/barberos/").data) == 1
    assert len(api_de("jesus").get("/api/barberos/").data) == 2
    assert len(api_de("jesus").get(f"/api/barberos/?sucursal={mundo['norte'].id}").data) == 1
