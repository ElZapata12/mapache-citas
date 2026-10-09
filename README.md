# MapacheCitas

Ya que el proyecto a sido subido a el repositorio en git hub y deseas ejecutarlo desde tu escritorio priemero debes de ir a tu editor de codigo y en este usando el comando:

"git clone "Agregamos la direccion de nuestro repositorio"".

Despues de esto ejecutamos:

"cd  frontend "

que es la direccion de la carpeta donde resguardamos el proyecto. Posteriormente ejecutamos en terminal 

"npm install "

Para asi checar que tengamos actualizado "node.js" y demas dependencias
Y yaal final simplemente ejecutamos:

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
