---
name: revisar-spec
description: Revisa una spec de 02-specs como un compañero exigente, señalando huecos, ambigüedades y criterios no verificables, sin reescribirla. Úsalo con /revisar-spec seguido del archivo.
---

# Revisar spec

1. **Lee** la spec indicada y, para contrastar, `01-producto/requisitos.md`, `01-producto/modelo-de-datos.md`, `01-producto/pantallas.md` y los ADR de `03-decisiones/`.
2. **Revisa estas preguntas:**
   - ¿Cada criterio de aceptación es verificable, con datos concretos en Dado / Cuando / Entonces?
   - ¿Cubre todas las reglas RN que dice cubrir? ¿Falta algún caso límite: bordes que se tocan, citas canceladas, concurrencia, permisos por rol, datos inválidos, registros inactivos?
   - ¿El contrato de API usa los mismos nombres de campos que el modelo de datos?
   - ¿Contradice algún ADR o regla de negocio?
   - ¿Cabe en una página y en un sprint? ¿Conviene dividirla?
   - ¿Falta aclarar algo en «Fuera de alcance»?
3. **Responde con una tabla**, ordenada de lo más a lo menos importante, máximo 10 filas:

   | # | Sección | Hallazgo | Por qué importa | Pregunta para el autor |

4. **No reescribas la spec** ni redactes criterios completos. Formula preguntas; puedes decir qué tipo de caso falta («falta un caso con cita cancelada»).
5. **Cierra con un veredicto:** «Lista para revisarse en equipo» o «Necesita otra vuelta», con el motivo en una frase.
