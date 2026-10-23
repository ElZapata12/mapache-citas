import pytest
from rest_framework.test import APIClient

from cuentas.models import Usuario

pytestmark = pytest.mark.django_db


def test_login_devuelve_token_y_sirve_para_yo():
    Usuario.objects.create_user("luis", password="mapache123", rol=Usuario.Rol.BARBERO)
    api = APIClient()

    malo = api.post("/api/auth/login/", {"username": "luis", "password": "otra"}, format="json")
    assert malo.status_code == 400

    bueno = api.post("/api/auth/login/", {"username": "luis", "password": "mapache123"}, format="json")
    assert bueno.status_code == 200
    token = bueno.data["token"]

    api.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    yo = api.get("/api/auth/yo/")
    assert yo.data["rol"] == "barbero"


def test_sin_token_no_hay_acceso():
    respuesta = APIClient().get("/api/barberos/")
    assert respuesta.status_code == 401
