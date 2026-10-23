from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


def datos_de_usuario(usuario):
    return {
        "id": usuario.id,
        "username": usuario.username,
        "nombre": usuario.get_full_name() or usuario.username,
        "rol": usuario.rol,
        "barbero": usuario.barbero_id,
    }


class LoginView(APIView):
    """POST /api/auth/login/ con {username, password} -> {token, usuario}"""

    permission_classes = [AllowAny]
    authentication_classes = []  # Para iniciar sesión no se necesita un token previo.

    def post(self, request):
        serializer = AuthTokenSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        usuario = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=usuario)
        return Response({"token": token.key, "usuario": datos_de_usuario(usuario)})


class LogoutView(APIView):
    """POST /api/auth/logout/ borra el token: la sesión deja de servir en todos lados."""

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=204)


class YoView(APIView):
    """GET /api/auth/yo/ -> datos del usuario dueño del token."""

    def get(self, request):
        return Response(datos_de_usuario(request.user))
