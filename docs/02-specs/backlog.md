# Backlog de specs

Cada fila es una funcionalidad completa (rebanada vertical): base de datos, API, pantalla y pruebas. La prioridad usa MoSCoW: **Debe**, **Debería**, **Podría**.

| Spec | Funcionalidad | RF | Pantallas | Prioridad | Sprint | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| [S-001](s-001-agendar-cita.md) | Agendar cita sin empalmes | RF-05, RF-06 | P03 | Debe | 1 | Borrador de ejemplo |
| S-005 | Buscar y registrar clientes | RF-03 | P05, P06 | Debe | 1 | Por escribir |
| S-006 | Ver la agenda del día | RF-07 | P02 | Debe | 2 | Por escribir |
| S-007 | Cambiar estado y reprogramar | RF-08, RF-09 | P04 | Debe | 2 | Por escribir |
| S-002 | Iniciar sesión con roles | RF-01 | P01 | Debe | 2 | Por escribir |
| S-008 | Resumen del día | RF-10 | P10 | Debería | 3 | Por escribir |
| S-003 | Gestionar servicios | RF-04 | P08 | Debería | 3 | Por escribir |
| S-004 | Gestionar barberos | RF-02 | P07 | Debería | 3 | Por escribir |
| S-009 | Recordatorio por WhatsApp | RF-11 | P04 | Podría | 3 | Por escribir |
| S-010 | Mi agenda en el celular (barbero) | RF-07 | P09 | Podría | 3 | Por escribir |

## Por qué este orden

- **S-001 primero:** es el corazón del producto y contiene la regla más difícil (RN-01). Si falla, todo lo demás no sirve.
- **Barberos y servicios al final:** mientras no existan sus pantallas, se capturan desde el **panel de administración de Django**. No reconstruimos la rueda: Django ya trae un CRUD, y nos ahorra una semana.
- **Login en el sprint 2:** al principio se prueba la API sin roles; cuando hay pantallas reales, se protegen.

## Ciclo de vida de una spec

`Por escribir` → `Borrador` → `Revisada` (otro integrante + `/revisar-spec`) → `Lista` (cumple la definición de listo) → `En desarrollo` → `Terminada` (cumple la definición de terminado).

Las reglas para pasar de un estado a otro están en [definición de listo y terminado](../04-proceso/definicion-de-terminado.md).
