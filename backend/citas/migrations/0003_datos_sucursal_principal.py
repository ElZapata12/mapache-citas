from django.db import migrations


def asignar_sucursal_principal(apps, schema_editor):
    # En una migración se usa apps.get_model, NO los modelos reales: así la migración
    # sigue funcionando aunque los modelos cambien en el futuro.
    Sucursal = apps.get_model("catalogo", "Sucursal")
    Barbero = apps.get_model("catalogo", "Barbero")
    Cita = apps.get_model("citas", "Cita")
    Usuario = apps.get_model("cuentas", "Usuario")

    # Base vacía (por ejemplo, la de las pruebas): no hay nada que migrar.
    if not (Barbero.objects.exists() or Usuario.objects.filter(rol="recepcion").exists()):
        return

    principal, _ = Sucursal.objects.get_or_create(nombre="Sucursal Principal")
    Barbero.objects.filter(sucursal__isnull=True).update(sucursal=principal)
    # Todos los barberos quedaron en la principal, así que sus citas también.
    Cita.objects.filter(sucursal__isnull=True).update(sucursal=principal)
    Usuario.objects.filter(rol="recepcion", sucursal__isnull=True).update(sucursal=principal)


class Migration(migrations.Migration):
    dependencies = [
        ("citas", "0002_cita_sucursal"),
        ("catalogo", "0002_sucursales"),
        ("cuentas", "0003_usuario_sucursal"),
    ]

    operations = [migrations.RunPython(asignar_sucursal_principal, migrations.RunPython.noop)]
