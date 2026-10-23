from django.db.models import Count, Q, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from cuentas.models import Usuario
from cuentas.permisos import EsAdmin, EsAdminORecepcion

from . import services
from .models import Cita, CitaServicio
from .serializers import (
    CambiarEstadoSerializer,
    CitaCrearSerializer,
    CitaSerializer,
    DisponibilidadSerializer,
    FechaSerializer,
    FiltroCitasSerializer,
)


def citas_visibles_para(usuario):
    """El barbero solo ve sus propias citas; admin y recepción ven todas."""
    citas = Cita.objects.select_related("barbero", "cliente").prefetch_related("servicios__servicio")
    if usuario.rol == Usuario.Rol.BARBERO:
        citas = citas.filter(barbero_id=usuario.barbero_id)
    return citas


class CitaListaCrearView(APIView):
    """GET /api/citas/?fecha=AAAA-MM-DD&barbero=ID   POST /api/citas/"""

    def get(self, request):
        filtros = FiltroCitasSerializer(data=request.query_params)
        filtros.is_valid(raise_exception=True)  # fecha o barbero mal escritos -> 400, no 500
        fecha = filtros.validated_data.get("fecha") or timezone.localdate()
        citas = citas_visibles_para(request.user).filter(inicio__date=fecha)
        barbero = filtros.validated_data.get("barbero")
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


class CitaDetalleView(APIView):
    """GET /api/citas/<id>/  (el barbero recibe 404 si la cita no es suya)"""

    def get(self, request, pk):
        cita = get_object_or_404(citas_visibles_para(request.user), pk=pk)
        return Response(CitaSerializer(cita).data)


class CitaEstadoView(APIView):
    """PATCH /api/citas/<id>/estado/ con {"estado": "atendida"}"""

    def patch(self, request, pk):
        cita = get_object_or_404(citas_visibles_para(request.user), pk=pk)
        entrada = CambiarEstadoSerializer(data=request.data)
        entrada.is_valid(raise_exception=True)
        services.cambiar_estado(cita, entrada.validated_data["estado"])
        return Response(CitaSerializer(cita).data)


class ResumenDiaView(APIView):
    """GET /api/reportes/dia/?fecha=AAAA-MM-DD  (solo administrador, RN-10)"""

    permission_classes = [EsAdmin]

    def get(self, request):
        entrada = FechaSerializer(data=request.query_params)
        entrada.is_valid(raise_exception=True)
        fecha = entrada.validated_data.get("fecha") or timezone.localdate()

        citas = Cita.objects.filter(inicio__date=fecha)
        por_estado = {e: 0 for e in Cita.Estado.values}
        for fila in citas.values("estado").annotate(n=Count("id")):
            por_estado[fila["estado"]] = fila["n"]

        # RN-07: solo las citas atendidas suman al cobrado.
        atendidas = CitaServicio.objects.filter(cita__inicio__date=fecha, cita__estado=Cita.Estado.ATENDIDA)
        cobrado = atendidas.aggregate(total=Sum("costo_cobrado"))["total"] or 0
        por_barbero = (
            citas.values("barbero__nombre")
            .annotate(
                citas=Count("id", distinct=True),
                atendidas=Count("id", filter=Q(estado=Cita.Estado.ATENDIDA), distinct=True),
                cobrado=Sum("servicios__costo_cobrado", filter=Q(estado=Cita.Estado.ATENDIDA)),
            )
            .order_by("barbero__nombre")
        )
        por_servicio = (
            atendidas.values("servicio__descripcion")
            .annotate(veces=Count("id"), cobrado=Sum("costo_cobrado"))
            .order_by("-cobrado")
        )
        return Response(
            {
                "fecha": fecha.isoformat(),
                "total_citas": citas.count(),
                "por_estado": por_estado,
                "cobrado": f"{cobrado:.2f}",
                "por_barbero": [
                    {
                        "barbero": f["barbero__nombre"],
                        "citas": f["citas"],
                        "atendidas": f["atendidas"],
                        "cobrado": f"{f['cobrado'] or 0:.2f}",
                    }
                    for f in por_barbero
                ],
                "por_servicio": [
                    {"servicio": f["servicio__descripcion"], "veces": f["veces"], "cobrado": f"{f['cobrado']:.2f}"}
                    for f in por_servicio
                ],
            }
        )
