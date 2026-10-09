# MapacheCitas

Sistema web de citas para la barbería **El Mapache Bigotón**. Permite agendar citas por barbero sin empalmes, registrar clientes y servicios, y consultar el resumen del día.

## Problema

La barbería lleva su agenda en papel. Eso provoca citas empalmadas, no se sabe qué barbero está libre, faltan datos de los clientes y nadie sabe cuánto se cobró en el día.

## Alcance del proyecto

### Incluye

| Funcionalidad | Usuario |
| --- | --- |
| Iniciar sesión con rol (administrador, recepción, barbero) | Todos |
| Agendar una cita eligiendo cliente, servicio, barbero, fecha y hora libre | Recepción |
| Impedir que un barbero tenga dos citas al mismo tiempo | Sistema |
| Ver la agenda del día en columnas por barbero | Recepción, administrador |
| Cambiar el estado de una cita: programada, atendida, cancelada, no asistió | Recepción, barbero |
| Reprogramar una cita | Recepción |
| Buscar y registrar clientes por nombre o teléfono | Recepción |
| Dar de alta y editar barberos y servicios | Administrador |
| Resumen del día: citas e ingresos por barbero y por servicio | Administrador |

### No incluye

- Reserva en línea por parte del cliente.
- Pagos en línea y facturación.
- Notificaciones automáticas por SMS o correo.

## Reglas principales

1. Un barbero no puede tener dos citas que se traslapen (las canceladas no cuentan).
2. La hora de fin se calcula con la duración del servicio, en bloques de 15 minutos.
3. Solo se agenda de lunes a sábado, de 10:00 a 20:00, y nunca en el pasado.
4. El teléfono del cliente (10 dígitos) no se repite.
5. El costo se guarda en la cita al agendar; si el precio del servicio cambia después, la cita conserva el suyo.
6. Solo las citas atendidas cuentan como ingreso.

## Tecnologías

| Parte | Tecnología |
| --- | --- |
| Backend (API) | Python · Django 5.2 LTS · Django REST Framework |
| Base de datos | PostgreSQL |
| Frontend | React · Vite |
| Diseño | Figma |

## Estructura del repositorio

```text
mapache-citas/
├── backend/     API con Django
├── frontend/    Interfaz con React
└── .github/     Plantillas de pull request y de tareas
```

## Cómo trabajamos

- `main` siempre funciona y nadie sube cambios directo a ella.
- Cada tarea se hace en su propia rama: `tipo/descripcion-corta` (por ejemplo `feat/agendar-cita`).
- Todo cambio entra por **pull request**, lo revisa otro integrante y se une con *squash merge*.
- Los commits siguen el formato `tipo(alcance): descripción`, por ejemplo `feat(citas): valida empalmes`.

- La guía completa está en [CONTRIBUTING.md](CONTRIBUTING.md).

## Equipo

| Integrante | Rol |
| --- | --- |
| Miguel [apellido] | Líder de proyecto · UX · Pruebas |
| [Nombre 2] | Backend · Base de datos |
| [Nombre 3] | Frontend · Pruebas |

## Estado

En arranque: estructura del repositorio y definición del alcance.