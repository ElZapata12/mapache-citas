---
name: nueva-adr
description: Guía para documentar una decisión técnica como ADR en 03-decisiones, haciendo preguntas una por una; el razonamiento lo escribe la persona. Úsalo con /nueva-adr.
---

# Nueva ADR

1. **Lee** `03-decisiones/indice-adr.md` para conocer el siguiente número y los ADR vigentes.
2. **Pregunta una cosa a la vez** y espera la respuesta antes de seguir:
   1. ¿Qué hay que decidir y por qué ahora?
   2. ¿Qué restricciones hay: plazo, conocimientos del equipo, requisitos RF o RN?
   3. ¿Qué opciones consideraste? Si solo hay una, pide al menos otra.
   4. Para cada opción: ¿qué tiene a favor y qué en contra?
   5. ¿Qué eliges y por qué?
   6. ¿Qué aceptas perder y cómo lo vas a mitigar?
3. **Aporta información solo si te la piden**: ventajas o riesgos conocidos de una opción y enlaces a documentación oficial. Márcala como «Aporte de Claude» para que se distinga del razonamiento del equipo.
4. **Escribe el archivo** `03-decisiones/adr-00XX-<tema>.md` con la plantilla `_plantillas/adr.md`, usando las palabras de la persona (puedes corregir ortografía, no el razonamiento), con estado «Propuesto». Agrega su fila al índice.
5. **Recuerda** que el ADR se acepta en un PR aprobado por los 3 integrantes.
