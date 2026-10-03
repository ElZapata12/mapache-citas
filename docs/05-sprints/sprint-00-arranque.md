---
sprint: 0
fechas: 2026-10-05 a 2026-10-09
objetivo: Repo, vault, CI y proyectos vacíos corriendo en las 3 máquinas
---

# Sprint 00 · Arranque (5–9 oct)

**Objetivo:** que los 3 puedan clonar el repositorio, levantar backend y frontend vacíos, abrir el vault y trabajar con el proceso desde el primer día.

> En este sprint no se programa ninguna funcionalidad. Se construye la «fábrica»: lo que hará que las siguientes 4 semanas fluyan.

## Plan

### Proceso (Miguel)

- [ ] Crear el repositorio en GitHub, invitar al equipo y proteger `main` (1 aprobación + CI en verde).
- [ ] Crear el tablero en GitHub Projects con las columnas de la [metodología](../04-proceso/metodologia.md).
- [ ] Subir este vault en un PR y que los otros dos lo aprueben.
- [ ] Firmar el [contrato de IA](../04-proceso/contrato-de-ia.md) y aceptar ADR-0002 y ADR-0003.
- [ ] Revisar en equipo la [spec S-001](../02-specs/s-001-agendar-cita.md) y escribir S-005.
- [ ] Actualizar en Figma los nombres de capa a la convención de Django.

### Backend y base de datos ([Integrante 2])

- [ ] Proyecto Django 5.2 en `backend/` con entorno virtual y dependencias fijadas.
- [ ] PostgreSQL local con Docker Compose.
- [ ] Modelo de usuario personalizado en la **primera** migración.
- [ ] Modelos `Barbero`, `Cliente` y `Servicio`, registrados en el panel de administración, con datos de prueba.
- [ ] `pytest-django` configurado con una prueba que pase.

### Frontend ([Integrante 3])

- [ ] Proyecto React + Vite en `frontend/`.
- [ ] Variables de color y tipografía tomadas de Fundamentos.
- [ ] Componentes `Boton` y `ChipEstado` según Figma.
- [ ] Llamada de prueba a `GET /api/salud` para confirmar que CORS funciona.

### En pareja (backend + líder)

- [ ] Integración continua en GitHub Actions: pruebas de backend y build de frontend en cada PR.

### Todos

- [ ] Cada quien escribe 1 nota de concepto de algo que aprendió esta semana.

## Diario

Formato: `fecha · nombre · ayer · hoy · bloqueos`

-

## Revisión (viernes)

¿Se cumplió el objetivo? ¿Qué se mostró funcionando y en qué máquina?

-

## Retrospectiva (viernes)

| Funcionó | No funcionó | Una acción para el sprint 01 |
| --- | --- | --- |
| | | |

## Métricas

| Tareas terminadas | Tiempo promedio de revisión | PR devueltos por explicación |
| --- | --- | --- |
| | | |
