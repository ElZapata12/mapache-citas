# Conceptos: por qué gira la rueda

Aquí cada integrante explica, **en sus palabras y sin IA**, los conceptos que usa el proyecto. Es la evidencia de que somos constructores. Usa la [plantilla de concepto](../_plantillas/concepto.md) y pon tu nombre en la tabla al escribirla.

La regla: si no puedes escribir la nota sin ayuda, todavía no lo entiendes. Pregúntale a Claudian con `/explicame`, cierra el chat y luego escribe.

## Sprint 00 · Arranque

| Concepto | Pregunta que responde | Autor |
| --- | --- | --- |
| Entorno virtual y dependencias fijadas | ¿Por qué mi proyecto no usa el Python de todo el sistema? | |
| Rama, commit, PR y squash merge | ¿Por qué nadie sube directo a `main`? | |
| Migración | ¿Cómo pasa un cambio del modelo de Python a una tabla en PostgreSQL? | |
| Modelo de usuario personalizado | ¿Por qué se define en la primera migración y no después? | |
| Integración continua | ¿Qué gana el equipo si las pruebas corren solas en cada PR? | |
| Docker Compose | ¿Por qué la base de datos corre en un contenedor? | |
| CORS | ¿Por qué el navegador bloquea al frontend si llama a la API sin permiso? | |

## Sprint 01 · Agendar

| Concepto | Pregunta que responde | Autor |
| --- | --- | --- |
| ORM y QuerySet | ¿Qué SQL genera `Cita.objects.filter(...)`? | |
| Serializer | ¿Qué valida un serializer y qué no le toca validar? | |
| APIView, vista genérica y ViewSet | ¿Qué código escribe Django por mí en cada nivel? | |
| Capa de servicios | ¿Por qué las reglas RN viven en `services.py`? | |
| Transacción (`atomic`) | ¿Qué pasa si dos citas se guardan al mismo tiempo? | |
| `ExclusionConstraint` y `btree_gist` | ¿Cómo impide PostgreSQL dos rangos de tiempo traslapados? | |
| Códigos HTTP 400 y 409 | ¿Cuándo es error del usuario y cuándo es un conflicto? | |
| Pruebas primero (TDD) | ¿Por qué escribir una prueba que falla antes del código? | |

## Sprint 02 · Operar el día

| Concepto | Pregunta que responde | Autor |
| --- | --- | --- |
| Sesión vs JWT | ¿Dónde vive la identidad del usuario en cada caso? | |
| Permisos por rol | ¿Dónde se decide que un barbero no ve las citas de otro? | |
| Estado en React | ¿Qué datos viven en el componente y cuáles vienen del servidor? | |
| Índices en la base de datos | ¿Por qué la agenda del día necesita un índice por barbero y fecha? | |

## Sprint 03 · Administrar

| Concepto | Pregunta que responde | Autor |
| --- | --- | --- |
| Agregaciones (`Sum`, `Count`) | ¿Cómo se calcula el cobrado del día en una sola consulta? | |
| Zona horaria | ¿Por qué guardar fechas «conscientes» de la zona horaria? | |
| Accesibilidad | ¿Qué necesita un botón para que lo use alguien con teclado o lector de pantalla? | |
| Despliegue | ¿Qué cambia entre correr en mi máquina y en un servidor? | |
