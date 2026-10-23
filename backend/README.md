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
| cita | barbero, cliente, inicio, fin, estado, notas |
| cita_servicio | cita, servicio, costo cobrado, duración (copia del momento de agendar) |
| usuario | correo, contraseña, rol (admin, recepcion, barbero) |

Estados de una cita: `programada`, `atendida`, `cancelada`, `no_asistio`.

## Reglas que aplica

- Rechaza una cita si el barbero ya tiene otra en ese horario. Se valida en el código y también en la base de datos.
- Calcula la hora de fin con la duración del servicio.
- Solo acepta citas de lunes a sábado, de 10:00 a 20:00, y nunca en el pasado.
- Barberos y servicios inactivos no se pueden usar en citas nuevas.
- Copia el costo del servicio a la cita al momento de agendar.

## Endpoints

Todas las rutas terminan en `/`. Salvo el login, piden el encabezado `Authorization: Token <token>`. Los errores tienen la forma `{"error": {"codigo", "mensaje", "campos"}}`.

| Método | Ruta | Para qué | Estado |
| --- | --- | --- | --- |
| POST | `/api/auth/login/` | Iniciar sesión | Listo |
| POST | `/api/auth/logout/` | Cerrar sesión | Listo |
| GET | `/api/auth/yo/` | Quién es el dueño del token | Listo |
| GET | `/api/barberos/` | Barberos activos | Listo |
| GET | `/api/servicios/` | Servicios activos | Listo |
| GET, POST | `/api/clientes/` | Buscar (`?q=`) y registrar clientes | Listo |
| GET, PATCH | `/api/clientes/{id}/` | Consultar y editar un cliente | Listo |
| GET | `/api/citas/?fecha=&barbero=` | Citas de un día (el barbero solo ve las suyas) | Listo |
| POST | `/api/citas/` | Crear una cita (409 si el horario está ocupado) | Listo |
| GET | `/api/disponibilidad/?barbero=&fecha=&servicios=` | Horarios libres | Listo |
| PATCH | `/api/citas/{id}/estado/` | Cambiar el estado de una cita | Pendiente (T-15) |
| GET | `/api/reportes/dia/?fecha=` | Resumen del día | Pendiente (T-17) |

## Organización del código

Las reglas del negocio van en archivos `services.py`, separadas de las vistas. Así se pueden probar solas y cualquiera del equipo sabe dónde buscarlas.

## Cómo correrlo

1. Levanta la base de datos (desde la raíz del repo): `docker compose up -d`
2. Entra al backend y activa tu entorno virtual.
3. Instala dependencias: `pip install -r requirements.txt`
4. Copia `.env.example` como `.env`.
5. Migra: `python manage.py migrate`
6. Corre el servidor: `python manage.py runserver`

## Pruebas

Con el entorno virtual activo y la base de datos arriba:

```bash
cd backend
pytest -v
```

Las reglas de las citas (empalmes, horario de 10:00 a 20:00, precio congelado y horarios disponibles) están en `citas/services.py` y se prueban en `citas/tests.py`. La API se prueba en `citas/test_api.py`.

## Datos de prueba

`python manage.py cargar_demo` crea 3 barberos y 6 servicios. Se puede correr varias veces sin duplicar.
