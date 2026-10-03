# Calendario y riesgos

Cinco sprints de una semana. Las fechas son una propuesta: ajústenlas a la fecha real de entrega. Si solo tienen 4 semanas, se juntan los sprints 3 y 4 y se recorta lo marcado como «Podría».

| Sprint | Fechas | Objetivo | Specs |
| --- | --- | --- | --- |
| [00 · Arranque](sprint-00-arranque.md) | 5–9 oct | Repo, vault, CI y proyectos vacíos corriendo en las 3 máquinas | ADR-0001 a 0003, S-001 revisada |
| 01 · Agendar | 12–16 oct | Agendar una cita sin empalmes, de la base de datos a la pantalla | S-001, S-005 |
| 02 · Operar el día | 19–23 oct | Ver la agenda, cambiar estados e iniciar sesión con roles | S-006, S-007, S-002 |
| 03 · Administrar | 26–30 oct | Resumen del día y catálogos; extras si hay tiempo | S-008, S-003, S-004, S-009, S-010 |
| 04 · Pulir y entregar | 2–6 nov | Prueba de punta a punta, errores, documentación y presentación | Ninguna nueva |

> **Capacidad:** el 2 de noviembre es Día de Muertos. Si no hay clases, el sprint 04 tiene un día menos: planéenlo desde ahora.

## Registro de riesgos

El líder lo revisa cada lunes en la planeación. Probabilidad e impacto: alta, media o baja.

| Riesgo | Prob. | Impacto | Qué hacemos para evitarlo | Responsable |
| --- | --- | --- | --- | --- |
| RN-01 (empalmes) resulta más difícil de lo previsto | Media | Alto | S-001 va primero; pruebas antes del código; trabajo en pareja | Backend + líder |
| Frontend y backend se integran tarde | Media | Alto | Contrato de API en cada spec; rebanadas verticales desde el sprint 1; CORS listo en el sprint 0 | Frontend |
| Alguien se ausenta una semana | Media | Medio | Revisión cruzada; cada módulo lo entienden 2 personas | Líder |
| Se usa IA sin entender el código | Alta | Alto | Contrato de IA; prueba de explicación en PR; defensa semanal | Todos |
| El alcance crece | Alta | Medio | Prioridad MoSCoW; lo «Podría» se cae primero; el líder dice no | Líder |
| «En mi máquina sí funciona» | Media | Medio | PostgreSQL con Docker Compose; pasos de instalación en el README; CI | Backend |
