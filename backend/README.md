# Backend · API de MapacheCitas

API REST que guarda los datos y aplica todas las reglas del negocio. El frontend no decide nada importante: siempre le pregunta a esta API.

## Tecnologías

- Python con Django 5.2 LTS y Django REST Framework
- PostgreSQL como base de datos
- pytest-django para las pruebas

## Datos que maneja

| Tabla | Campos principales |
| --- | --- |
| barbero | nombre, teléfono, activo |
| cliente | nombre, teléfono (único, 10 dígitos), notas |
| servicio | descripción, costo, duración en minutos, activo |
| cita | barbero, cliente, servicio, fecha, hora de inicio, hora de fin, costo cobrado, estado, notas |
| usuario | correo, contraseña, rol (admin, recepcion, barbero) |

Estados de una cita: `programada`, `atendida`, `cancelada`, `no_asistio`.

## Reglas que aplica

- Rechaza una cita si el barbero ya tiene otra en ese horario. Se valida en el código y también en la base de datos.
- Calcula la hora de fin con la duración del servicio.
- Solo acepta citas de lunes a sábado, de 10:00 a 20:00, y nunca en el pasado.
- Barberos y servicios inactivos no se pueden usar en citas nuevas.
- Copia el costo del servicio a la cita al momento de agendar.

## Endpoints planeados

| Método | Ruta | Para qué |
| --- | --- | --- |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/citas?fecha=` | Citas de un día |
| POST | `/api/citas` | Crear una cita (responde 409 si el horario está ocupado) |
| PATCH | `/api/citas/{id}/estado` | Cambiar el estado de una cita |
| GET | `/api/disponibilidad?fecha=&barbero=&servicio=` | Horarios libres |
| GET, POST | `/api/clientes` | Buscar y registrar clientes |
| GET, POST | `/api/barberos` | Listar y registrar barberos |
| GET, POST | `/api/servicios` | Listar y registrar servicios |
| GET | `/api/reportes/dia?fecha=` | Resumen del día |

## Organización del código

Las reglas del negocio van en archivos `services.py`, separadas de las vistas. Así se pueden probar solas y cualquiera del equipo sabe dónde buscarlas.

## Cómo correrlo

1. Levanta la base de datos (desde la raíz del repo): `docker compose up -d`
2. Entra al backend y activa tu entorno virtual.
3. Instala dependencias: `pip install -r requirements.txt`
4. Copia `.env.example` como `.env`.
5. Migra: `python manage.py migrate`
6. Corre el servidor: `python manage.py runserver`



