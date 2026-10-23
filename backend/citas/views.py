from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from cuentas.models import Usuario
from cuentas.permisos import EsAdminORecepcion

from . import services
from .models import Cita
from .serializers import CitaCrearSerializer, CitaSerializer, DisponibilidadSerializer


def citas_visibles_para(usuario):
    """El barbero solo ve sus propias citas; admin y recepción ven todas."""
    citas = Cita.objects.select_related("barbero", "cliente").prefetch_related("servicios__servicio")
    if usuario.rol == Usuario.Rol.BARBERO:
        citas = citas.filter(barbero_id=usuario.barbero_id)
    return citas


class CitaListaCrearView(APIView):
    """GET /api/citas/?fecha=AAAA-MM-DD&barbero=ID   POST /api/citas/"""

    def get(self, request):
        fecha = request.query_params.get("fecha") or timezone.localdate().isoformat()
        citas = citas_visibles_para(request.user).filter(inicio__date=fecha)
        barbero = request.query_params.get("barbero")
        if barbero:
            citas = citas.filter(barbero_id=barbero)
        return Response(CitaSerializer(citas, many=True).data)

    def post(self, request):
        if request.user.rol == Usuario.Rol.BARBERO:
            return Response(
                {"error": {"codigo": "SIN_PERMISO", "mensaje": "Solo recepción o administración agendan citas."}},
                status=status.HTTP_403_FORBIDDEN,
            )
        entrada = CitaCrearSerializer(data=request.data)
        entrada.is_valid(raise_exception=True)
        datos = entrada.validated_data
        cita = services.crear_cita(
            barbero_id=datos["barbero"],
            cliente_id=datos["cliente"],
            servicio_ids=datos["servicios"],
            fecha=datos["fecha"],
            hora_inicio=datos["hora_inicio"],
            notas=datos.get("notas", ""),
        )
        cita = citas_visibles_para(request.user).get(pk=cita.pk)
        return Response(CitaSerializer(cita).data, status=status.HTTP_201_CREATED)


class DisponibilidadView(APIView):
    """GET /api/disponibilidad/?barbero=1&fecha=2026-10-28&servicios=1&servicios=3"""

    permission_classes = [EsAdminORecepcion]

    def get(self, request):
        entrada = DisponibilidadSerializer(
            data={
                "barbero": request.query_params.get("barbero"),
                "fecha": request.query_params.get("fecha"),
                "servicios": request.query_params.getlist("servicios"),
            }
        )
        entrada.is_valid(raise_exception=True)
        datos = entrada.validated_data
        horarios = services.horarios_disponibles(
            barbero_id=datos["barbero"], servicio_ids=datos["servicios"], fecha=datos["fecha"]
        )
        return Response({"horarios": horarios})
