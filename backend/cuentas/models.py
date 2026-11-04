from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models


class Usuario(AbstractUser):
    """Usuario del sistema. Hereda usuario, contraseña, nombre, correo, etc. de Django
    y agrega el rol, que decide qué puede hacer cada quien."""

    class Rol(models.TextChoices):
        ADMIN = "admin", "Administrador"
        RECEPCION = "recepcion", "Recepción"
        BARBERO = "barbero", "Barbero"

    rol = models.CharField(max_length=10, choices=Rol.choices, default=Rol.RECEPCION)
    barbero = models.OneToOneField(
        "catalogo.Barbero",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="usuario",
        help_text="Solo para usuarios con rol barbero.",
    )

    sucursal = models.ForeignKey(
        "catalogo.Sucursal",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="usuarios",
        help_text="Recepción: su sucursal. Administrador: vacío (ve todas). Barbero: se toma de su barbero.",
    )

    @property
    def sucursal_efectiva(self):
        """La sucursal que este usuario puede operar. None = todas (administrador)."""
        if self.rol == self.Rol.BARBERO and self.barbero_id:
            return self.barbero.sucursal
        return self.sucursal

    @property
    def sucursal_efectiva_id(self):
        sucursal = self.sucursal_efectiva
        return sucursal.id if sucursal else None

    def clean(self):
        super().clean()
        if self.rol == self.Rol.RECEPCION and not self.sucursal_id:
            raise ValidationError({"sucursal": "Recepción debe tener una sucursal."})

    def __str__(self):
        return f"{self.username} ({self.get_rol_display()})"
