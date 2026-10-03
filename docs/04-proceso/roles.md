# Roles: 3 personas, 5 sombreros

Los cinco roles del proyecto (UX, Frontend, Backend, Administrador de BD, Tester) se reparten como «sombreros». Cada persona tiene uno principal y uno secundario; el liderazgo es un sombrero extra.

| Persona | Sombrero principal | Sombrero secundario | Además |
| --- | --- | --- | --- |
| Miguel | UX (Figma y criterios de aceptación) | Tester (casos de prueba y prueba de punta a punta) | **Líder de proyecto** y dueño del backlog |
| [Integrante 2] | Backend (Django, DRF, reglas RN) | Administrador de BD (PostgreSQL, migraciones, respaldo) | |
| [Integrante 3] | Frontend (React) | Tester (pruebas de componentes) | |

## Regla del «factor autobús»

Si alguien se enferma una semana, el proyecto no se detiene. Por eso:

- **Revisión cruzada:** el backend lo revisa quien hace frontend o el líder, y viceversa. Nadie revisa solo su propia área.
- Cada módulo debe poder explicarlo **al menos dos personas**. La «defensa» de los miércoles lo comprueba.
- El líder también programa: toma al menos una tarea pequeña por sprint.

## Qué hace el líder de proyecto

- Mantiene el [backlog](../02-specs/backlog.md) priorizado y dice **no** a lo que no cabe en el plazo.
- Facilita las ceremonias y escribe la nota del sprint junto con el equipo.
- Quita bloqueos: si alguien lleva medio día atorado, se resuelve en pareja ese mismo día.
- Cuida el [contrato de IA](contrato-de-ia.md) y la [definición de terminado](definicion-de-terminado.md).
- Lleva el registro de riesgos del [calendario](../05-sprints/calendario.md) y las métricas de la [metodología](metodologia.md).

## Qué NO hace el líder

- No asigna tareas sin preguntar: en la planeación cada quien elige, y el líder equilibra.
- No aprueba sus propios PR ni se salta la revisión.
