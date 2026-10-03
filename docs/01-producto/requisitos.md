# Requisitos y reglas de negocio

Cada spec en `02-specs/` cita los RF y RN que cubre. Si un requisito cambia, se cambia aquí primero y se avisa en el sprint.

## Requisitos funcionales (RF)

| ID | Requisito | Usuario | Spec |
| --- | --- | --- | --- |
| RF-01 | Iniciar sesión con correo y contraseña; el menú cambia según el rol | Todos | S-002 |
| RF-02 | Alta, edición y baja lógica de barberos | Administrador | S-004 |
| RF-03 | Alta, edición y búsqueda de clientes por nombre o teléfono | Recepción | S-005 |
| RF-04 | Alta y edición de servicios (descripción, costo en MXN, duración) | Administrador | S-003 |
| RF-05 | Crear cita con fecha, hora, barbero, cliente y servicio | Recepción | S-001 |
| RF-06 | Rechazar la cita si el barbero ya tiene otra en ese horario | Sistema | S-001 |
| RF-07 | Agenda del día en columnas por barbero y vista semanal | Recepción, barbero | S-006, S-010 |
| RF-08 | Cambiar estado: programada, atendida, cancelada, no asistió | Recepción, barbero | S-007 |
| RF-09 | Reprogramar una cita revalidando disponibilidad | Recepción | S-007 |
| RF-10 | Resumen del día: citas e ingresos por barbero y servicio | Administrador | S-008 |
| RF-11 | Recordatorio que abre WhatsApp con el mensaje prellenado | Recepción | S-009 |

## Reglas de negocio (RN)

| ID | Regla |
| --- | --- |
| RN-01 | Una cita nueva de un barbero no puede traslaparse con otra suya que no esté cancelada. |
| RN-02 | `hora_fin = hora_inicio + duración del servicio`; la agenda usa bloques de 15 minutos. |
| RN-03 | Solo se agenda de lunes a sábado, de 10:00 a 20:00. |
| RN-04 | No se agendan citas en el pasado. |
| RN-05 | El teléfono (10 dígitos) identifica al cliente y no se repite. |
| RN-06 | Al agendar se copia el costo del servicio a `cita.costo_cobrado`. |
| RN-07 | Solo las citas atendidas suman al resumen de ingresos. |
| RN-08 | Un barbero o servicio inactivo no aparece para citas nuevas, pero se conserva en el historial. |

Estados de una cita: **programada** → atendida, cancelada o no asistió. Solo una cita programada puede reprogramarse.

## Requisitos no funcionales (RNF)

| ID | Requisito |
| --- | --- |
| RNF-01 | Pantallas usables de 360 px (celular) a 1440 px (escritorio). |
| RNF-02 | La API responde en menos de 2 segundos con datos de prueba. |
| RNF-03 | Contraseñas con hash; la API solo se expone por HTTPS en producción. |
| RNF-04 | Español de México, moneda MXN, zona horaria America/Mexico_City. |
| RNF-05 | Todo cambio pasa por pull request con al menos una revisión y pruebas en verde. |
