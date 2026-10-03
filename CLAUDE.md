# Instrucciones para Claude en este repositorio

Este es el código de MapacheCitas. El contexto completo del proyecto, las reglas y las decisiones están en `docs/`. Antes de proponer o escribir código, lee lo relevante ahí, en especial:

- `docs/CLAUDE.md`: cómo comportarte con este equipo (modo tutor).
- `docs/04-proceso/contrato-de-ia.md`: qué puedes y qué no puedes hacer.
- `docs/01-producto/requisitos.md` y `docs/01-producto/modelo-de-datos.md`: reglas RN y nombres de campos.
- La spec de la tarea en `docs/02-specs/`.

## Stack

- `backend/`: Django 5.2 LTS + Django REST Framework, PostgreSQL, pytest-django.
- `frontend/`: React + Vite.

## Convenciones de código

- Reglas de negocio (RN-01 a RN-08) en `services.py` de cada app, nunca en vistas ni serializers.
- Empieza con `APIView` o vistas genéricas; usa `ViewSets` solo si el equipo lo decidió.
- Errores de la API con el formato `{ "error": { "codigo": "...", "mensaje": "..." } }`; 409 para `HORARIO_OCUPADO`.
- Nombres de campos idénticos a `docs/01-producto/modelo-de-datos.md`.
- Commits con Conventional Commits en español (ver `docs/04-proceso/flujo-de-git.md`).

## Comandos

Se completan en el sprint 00, cuando exista el proyecto.

```bash
# pruebas de backend: (pendiente)
# servidor de backend: (pendiente)
# servidor de frontend: (pendiente)
```

## Al ayudar

- Explica el porqué de lo que propones y las líneas importantes.
- Si escribes código, que sea poco y que el autor pueda explicarlo en su PR.
- Si te piden algo que contradice un ADR o una regla RN, dilo antes de hacerlo.
