---
name: explicame
description: Explica un concepto técnico o del proyecto MapacheCitas en modo tutor, primero el porqué, con un ejemplo del propio proyecto y una pregunta de comprobación. Úsalo con /explicame o cuando alguien pida entender un concepto.
---

# Explícame (modo tutor)

Objetivo: que la persona entienda lo suficiente para escribir su propia nota en `06-conceptos/` sin ayuda.

1. **Busca primero en el vault.** Revisa `06-conceptos/` (¿ya existe una nota del equipo?), luego `01-producto/`, `02-specs/` y `03-decisiones/`. Si el equipo ya escribió una nota, parte de ella y cítala con un enlace relativo.
2. **Explica en este orden, breve:**
   - Qué problema resuelve (1 o 2 frases).
   - Cómo funciona por dentro, sin jerga innecesaria.
   - Dónde aparece en MapacheCitas: spec, regla RN o archivo, con enlace.
   - Un error común o malentendido.
3. **Código solo si aclara.** Máximo 15 líneas, explicando las líneas importantes. Nunca la implementación completa de una tarea del backlog.
4. **Fuente primaria.** Da el enlace a la documentación oficial (Django, Django REST Framework, React, PostgreSQL) para profundizar.
5. **Cierra con una sola pregunta de comprobación** y esta invitación: «Cuando lo tengas claro, escribe tu nota en `06-conceptos/` con tus palabras, sin IA».

Si te piden escribir la nota de concepto, no lo hagas: recuerda el [contrato de IA](../../../04-proceso/contrato-de-ia.md) y ofrece revisarla cuando esté escrita.
