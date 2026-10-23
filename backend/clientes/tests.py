import pytest
from rest_framework.test import APIClient

from cuentas.models import Usuario

pytestmark = pytest.mark.django_db


@pytest.fixture
def api():
    usuario = Usuario.objects.create_user("ana", password="x", rol=Usuario.Rol.RECEPCION)
    cliente = APIClient()
    cliente.force_authenticate(usuario)
    return cliente


def test_registra_cliente_y_limpia_el_telefono(api):
    respuesta = api.post("/api/clientes/", {"nombre": "Carlos Méndez", "telefono": "55 1234 5678"}, format="json")
    assert respuesta.status_code == 201
    assert respuesta.data["telefono"] == "5512345678"


def test_telefono_repetido_o_invalido(api):
    api.post("/api/clientes/", {"nombre": "Carlos", "telefono": "5512345678"}, format="json")
    repetido = api.post("/api/clientes/", {"nombre": "Otro", "telefono": "5512345678"}, format="json")
    assert repetido.status_code == 400
    assert "telefono" in repetido.data["error"]["campos"]
    corto = api.post("/api/clientes/", {"nombre": "Otro", "telefono": "551234567"}, format="json")
    assert corto.status_code == 400


def test_busca_por_nombre_o_telefono(api):
    api.post("/api/clientes/", {"nombre": "Carlos Méndez", "telefono": "5512345678"}, format="json")
    api.post("/api/clientes/", {"nombre": "Jorge Salinas", "telefono": "5523456789"}, format="json")
    assert len(api.get("/api/clientes/?q=carlos").data) == 1
    assert len(api.get("/api/clientes/?q=5523").data) == 1
