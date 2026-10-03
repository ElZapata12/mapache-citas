# Pantallas

El diseño vive en Figma (`MapacheCitas · App`). La guía visual de referencia está en [MapacheCitas · Guía visual para Figma](https://claude.ai/artifact/HRkBp7jfn4XJPb62RvGsFd) (privada hasta que se comparta).

| ID | Pantalla | Usuario | Spec | Endpoint principal |
| --- | --- | --- | --- | --- |
| P01 | Inicio de sesión | Todos | S-002 | POST /api/auth/login |
| P02 | Agenda del día por barbero | Recepción, admin | S-006 | GET /api/citas?fecha= |
| P03 | Nueva cita / reprogramar (+ error horario ocupado) | Recepción | S-001 | GET /api/disponibilidad, POST /api/citas |
| P04 | Detalle de cita | Recepción, barbero | S-007, S-009 | PATCH /api/citas/{id}/estado |
| P05 | Clientes: lista y búsqueda | Recepción | S-005 | GET /api/clientes?q= |
| P06 | Alta / edición de cliente | Recepción | S-005 | POST /api/clientes |
| P07 | Barberos | Administrador | S-004 | /api/barberos |
| P08 | Servicios | Administrador | S-003 | /api/servicios |
| P09 | Mi agenda (móvil) | Barbero | S-010 | GET /api/citas?fecha=&barbero= |
| P10 | Resumen del día | Administrador | S-008 | GET /api/reportes/dia?fecha= |

## Reglas de diseño que no cambian

- Estados con color y nombre fijos: programada (azul), atendida (verde), cancelada (gris), no asistió (rojo).
- Cada pantalla tiene estados vacío, cargando, error y éxito.
- Nombre de capa en Figma = nombre del campo en la API y en la base de datos.
- Una pantalla solo pasa a desarrollo cuando está marcada como «Listo para desarrollo».
