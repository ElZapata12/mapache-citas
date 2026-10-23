from django.contrib.auth.models import AbstractUser
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

    def __str__(self):
        return f"{self.username} ({self.get_rol_display()})"