# Registro de decisiones (ADR)

Un ADR documenta una decisión técnica que sería caro cambiar después. No se borra: si cambia la decisión, se escribe un ADR nuevo que **reemplaza** al anterior y se marca el viejo como «Reemplazado por ADR-XXXX».

| ADR | Decisión | Estado | Fecha |
| --- | --- | --- | --- |
| [ADR-0001](adr-0001-django-drf.md) | Django 5.2 LTS + DRF para la API, React para el frontend | Aceptado | 2026-10-02 |
| [ADR-0002](adr-0002-documentacion-en-el-repo.md) | El vault de Obsidian vive dentro del repositorio | Propuesto | 2026-10-02 |
| [ADR-0003](adr-0003-metodologia-sdd.md) | Spec-Driven Development ligero con sprints de una semana | Propuesto | 2026-10-02 |
| ADR-0004 | Autenticación: sesión de Django o JWT | Pendiente (sprint 2) | |
| ADR-0005 | Dónde se despliega la demo | Pendiente (sprint 3) | |

## Cuándo escribir un ADR

- Elegir o cambiar una tecnología, librería o servicio.
- Una decisión de arquitectura que afecta a más de una persona (formato de errores, autenticación, estructura de carpetas).
- Cuando alguien pregunta «¿y por qué lo hicimos así?» y la respuesta no está escrita.

## Cómo

Usa la [plantilla](../_plantillas/adr.md) o pide a Claudian `/nueva-adr`: te hará preguntas, pero las respuestas son tuyas. Un ADR se discute en el PR que lo agrega y se acepta cuando los 3 lo aprueban.
