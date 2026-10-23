# MapacheCitas

Sistema de citas para la barbería **El Mapache Bigotón**: agenda por barbero sin empalmes, varios servicios por cita, clientes y resumen del día.

Proyecto escolar de 3 personas. Es una demo que corre en una computadora.

## Qué hace

- Iniciar sesión con usuario y contraseña; el menú y los permisos cambian según el rol (administrador, recepción, barbero).
- Buscar y registrar clientes (el teléfono de 10 dígitos no se repite).
- Agendar una cita con **uno o varios servicios**; solo se ofrecen los horarios libres.
- Ver la agenda de un día agrupada por barbero.
- Marcar una cita como atendida, cancelada o no asistió, y mandar un recordatorio por WhatsApp.
- Resumen del día para el administrador: citas y dinero cobrado por barbero y por servicio.
- Los barberos y servicios se administran desde el panel de Django (`/admin/`).

## Reglas principales

1. Un barbero no puede tener dos citas que se traslapen (las canceladas no cuentan). Se valida en Python y también en PostgreSQL.
2. La duración de la cita es la suma de sus servicios, redondeada a bloques de 15 minutos.
3. Solo se agenda de lunes a sábado, de 10:00 a 20:00, y nunca en el pasado.
4. El teléfono del cliente (10 dígitos) no se repite.
5. El costo y la duración se copian a la cita al agendar; si después cambia el precio, la cita conserva el suyo.
6. Solo las citas atendidas cuentan como ingreso.
7. Solo una cita programada puede cambiar de estado.
8. El barbero solo ve y modifica sus propias citas y no agenda. Solo el administrador ve dinero.

## Tecnologías

| Parte | Tecnología |
| --- | --- |
| Backend (API) | Python · Django 5.2 LTS · Django REST Framework |
| Base de datos | PostgreSQL 16 (en Docker) |
| Frontend | React · Vite |

## Requisitos para correrlo

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) abierto
- Python 3.11 o más nuevo
- Node.js 20 o más nuevo
- Git

## Cómo correrlo (primera vez)

Se necesitan **tres cosas encendidas**: la base de datos, el backend y el frontend.

**1. Clonar el repositorio**
```bash
git clone https://github.com/ElZapata12/mapache-citas.git
cd mapache-citas
```

**2. Base de datos** (desde la raíz del repo)
```bash
docker compose up -d
```

**3. Backend** (en la terminal 1)

| Windows (PowerShell) | Mac / Linux |
| --- | --- |
| `cd backend` | `cd backend` |
| `python -m venv venv` | `python3 -m venv venv` |
| `venv\Scripts\activate` | `source venv/bin/activate` |
| `pip install -r requirements.txt` | `pip install -r requirements.txt` |
| `copy .env.example .env` | `cp .env.example .env` |

Después, igual en los dos:
```bash
python manage.py migrate
python manage.py cargar_demo --con-citas
python manage.py runserver
```
`cargar_demo` crea barberos, servicios, clientes y los tres usuarios de prueba. Con `--con-citas` agrega además 5 citas de ejemplo para el próximo día hábil. Se puede repetir sin duplicar nada.

Si PowerShell bloquea `activate`, corre una vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

**4. Frontend** (en la terminal 2, desde la raíz del repo)
```bash
cd frontend
npm install
npm run dev
```

**5. Abrir** `http://localhost:5173`

| Usuario | Contraseña | Rol | Qué ve |
| --- | --- | --- | --- |
| `recepcion` | `mapache123` | Recepción | Agenda, nueva cita y clientes |
| `luis` | `mapache123` | Barbero | Solo su agenda |
| `admin` | `mapache123` | Administrador | Todo, más el resumen del día. También entra a `http://127.0.0.1:8000/admin/` |

Las contraseñas son solo de prueba.

## Cada día

```bash
docker compose up -d
cd backend && python manage.py runserver     # con el entorno virtual activo
cd frontend && npm run dev                    # en otra terminal
```

## Pruebas automáticas

```bash
cd backend
pytest -v
```

Cubren las reglas de negocio (empalmes, horario, estados, precio congelado), la API, los permisos por rol y el resumen. Para revisar el frontend: `cd frontend && npm run lint`.

## Si algo falla

| Síntoma | Solución |
| --- | --- |
| `connection refused` al migrar | Docker no está abierto o la base no arrancó: `docker compose up -d` y `docker compose ps` |
| `InconsistentMigrationHistory` | La base tiene migraciones viejas: `docker compose down -v`, `docker compose up -d` y repite `migrate` |
| Puerto 5432, 8000 o 5173 ocupado | Cierra el programa que lo usa (por ejemplo, un PostgreSQL instalado en la computadora) |
| En «Nueva cita» no salen horarios | Hoy ya pasó la hora o es domingo: elige otra fecha |
| Quiero empezar de cero | `docker compose down -v`, `docker compose up -d`, `migrate`, `cargar_demo --con-citas` |

## Estructura del repositorio

```text
mapache-citas/
├── backend/     API con Django (apps: cuentas, catalogo, clientes, citas)
├── frontend/    Interfaz con React
├── docker-compose.yml   Base de datos PostgreSQL
└── .github/     Plantillas de pull request y de tareas
```

La documentación de la API está en [backend/README.md](backend/README.md) y la del frontend en [frontend/README.md](frontend/README.md).

## Cómo trabajamos

- `main` siempre funciona y nadie sube cambios directo a ella.
- Cada tarea se hace en su propia rama: `tipo/descripcion-corta` (por ejemplo `feat/agendar-cita`).
- Todo cambio entra por **pull request**, lo revisa otro integrante y se une con *merge commit* para conservar la autoría de cada quien.
- Los commits siguen el formato `tipo(alcance): descripción`, por ejemplo `feat(citas): valida empalmes`.
- La guía completa está en [CONTRIBUTING.md](CONTRIBUTING.md).

## Equipo

| Integrante | Rol |
| --- | --- |
| Miguel Zapata (ElZapata12) | Líder de proyecto · Backend y frontend |
| David Garcia (Garcia6od) | Backend · Base de datos |
| Diego Lorenzo (UNDERTAKER775) | Frontend · Pruebas |
