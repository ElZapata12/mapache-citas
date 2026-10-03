# MapacheCitas · Vault del equipo

Este vault es la memoria del proyecto: qué construimos, por qué lo decidimos y qué aprendimos. Vive dentro del repositorio (`docs/`), así que cada cambio queda en el historial de Git y Claudian puede consultarlo.

> **Regla de oro:** si una decisión, un acuerdo o un aprendizaje no está aquí, no existe.

## Dónde está cada cosa

| Carpeta | Qué guarda | Quién la escribe |
| --- | --- | --- |
| [01-producto](01-producto/vision.md) | Visión, requisitos, reglas de negocio, modelo de datos, pantallas, glosario | Líder + equipo |
| [02-specs](02-specs/backlog.md) | Una spec por funcionalidad: qué, por qué y criterios de aceptación | Quien toma la funcionalidad |
| [03-decisiones](03-decisiones/indice-adr.md) | ADR: decisiones técnicas con contexto y consecuencias | Quien propone la decisión |
| [04-proceso](04-proceso/metodologia.md) | Metodología, roles, contrato de IA, flujo de Git, definición de terminado | Líder |
| [05-sprints](05-sprints/calendario.md) | Plan, avances diarios, revisión y retrospectiva de cada semana | Todo el equipo |
| [06-conceptos](06-conceptos/indice-conceptos.md) | Notas de aprendizaje en nuestras palabras ("por qué gira la rueda") | Cada integrante, sin IA |
| `_plantillas` | Plantillas para spec, ADR, sprint, retro y concepto | Líder |

## Estado actual

- **Sprint en curso:** [Sprint 00 · Arranque](05-sprints/sprint-00-arranque.md)
- **Stack:** Django 5.2 LTS + Django REST Framework · React + Vite · PostgreSQL ([ADR-0001](03-decisiones/adr-0001-django-drf.md))
- **Diseño:** guía visual de pantallas P01–P10 (enlace en [pantallas](01-producto/pantallas.md))

## Cómo preguntarle a Claudian

Claudian lee este vault y el archivo [CLAUDE.md](CLAUDE.md), que le dice cómo comportarse aquí. Úsalo como **tutor y revisor**, no como autor.

- `/explicame <tema>`: explica un concepto del proyecto y te hace una pregunta para comprobar que lo entendiste.
- `/revisar-spec <archivo>`: señala huecos y ambigüedades en una spec, sin reescribirla.
- `/nueva-adr`: te guía con preguntas para documentar una decisión.
- `/preparar-retro`: junta lo que pasó en el sprint para la retrospectiva.

Ejemplos de preguntas útiles:

- "¿Por qué la regla RN-01 se valida en el backend y también en la base de datos?"
- "Según el ADR-0001, ¿qué riesgo aceptamos al elegir Django?"
- "¿Qué criterios de aceptación de S-001 todavía no tienen prueba?"
