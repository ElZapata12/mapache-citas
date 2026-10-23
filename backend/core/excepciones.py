from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


class ReglaDeNegocioError(Exception):
    """Error que lanzan los servicios cuando se rompe una regla del negocio (RN)."""

    def __init__(self, codigo, mensaje, status_http=status.HTTP_400_BAD_REQUEST):
        super().__init__(mensaje)
        self.codigo = codigo
        self.mensaje = mensaje
        self.status_http = status_http


def manejador_de_errores(exc, context):
    """Convierte cualquier error en el formato único de la API:
    {"error": {"codigo": "...", "mensaje": "...", "campos": {...}}}
    """
    if isinstance(exc, ReglaDeNegocioError):
        return Response(
            {"error": {"codigo": exc.codigo, "mensaje": exc.mensaje}},
            status=exc.status_http,
        )

    respuesta = exception_handler(exc, context)
    if respuesta is None:
        return None  # Error inesperado: Django muestra el error 500.

    if respuesta.status_code == status.HTTP_400_BAD_REQUEST and isinstance(respuesta.data, dict):
        respuesta.data = {
            "error": {
                "codigo": "VALIDACION",
                "mensaje": "Revisa los datos enviados.",
                "campos": respuesta.data,
            }
        }
    else:
        detalle = respuesta.data.get("detail", "") if isinstance(respuesta.data, dict) else respuesta.data
        codigos = {401: "NO_AUTENTICADO", 403: "SIN_PERMISO", 404: "NO_ENCONTRADO", 405: "METODO_NO_PERMITIDO"}
        if respuesta.status_code == status.HTTP_404_NOT_FOUND:
            detalle = "No se encontró lo que buscas."  # Django lo manda en inglés ("No Cita matches...")
        respuesta.data = {
            "error": {
                "codigo": codigos.get(respuesta.status_code, "ERROR"),
                "mensaje": str(detalle),
            }
        }
    return respuesta
