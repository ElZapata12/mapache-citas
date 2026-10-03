---
name: preparar-retro
description: Reúne los hechos del sprint actual (diario, tareas, commits y PR) para la revisión y la retrospectiva del viernes, sin escribir las conclusiones por el equipo. Úsalo con /preparar-retro.
---

# Preparar retrospectiva

1. **Encuentra la nota del sprint actual** en `05-sprints/` (la indicada en `00-inicio.md` o la más reciente).
2. **Reúne hechos, no opiniones:**
   - Tareas planeadas contra tareas marcadas como hechas.
   - Bloqueos mencionados en el diario y cuántos días duraron.
   - Si puedes leer el repositorio (`../`), resume con `git log --since` la semana: commits y PR unidos por persona, y PR que tardaron más de 24 horas en unirse.
   - Criterios de aceptación de las specs del sprint que todavía no tienen prueba.
   - Riesgos del `calendario.md` que ocurrieron.
3. **Presenta los hechos** en tablas cortas, sin juzgar a nadie.
4. **Propón 3 preguntas** para la retrospectiva basadas en esos hechos, por ejemplo: «El PR de S-001 tardó 3 días en revisión: ¿qué lo detuvo?».
5. **No llenes** la tabla «Funcionó / No funcionó / Una acción»: eso lo decide el equipo en la reunión.
