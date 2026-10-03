# Contrato de IA

> **La IA puede escribir; solo nosotros firmamos.**

Usamos IA todos los días. Este contrato marca la línea entre ser constructores y ser personas que solo copian lo que la IA produce. Lo firmamos los 3 y lo revisamos en cada retrospectiva.

## Semáforo

| | Qué incluye |
| --- | --- |
| **Verde · libre** | Explicar conceptos y errores · revisar specs y PR · generar datos de prueba · configuración repetitiva · sugerir casos límite · comparar opciones para un ADR |
| **Amarillo · con declaración y explicación** | Generar código de vistas, serializers, componentes o pruebas · refactorizar · escribir consultas |
| **Rojo · no se hace** | Escribir specs, criterios de aceptación, retros o notas de concepto por nosotros · implementar una regla RN sin haber escrito antes sus pruebas o su pseudocódigo · subir código que no puedes explicar · pegar contraseñas, tokens, `.env` o datos reales de clientes |

## Las 6 reglas

1. **Regla de los 10 minutos.** Ante un error, primero 10 minutos leyendo el mensaje completo, el traceback y la documentación. Luego pide «explícame este error», no «arréglalo».
2. **Declárala.** Todo PR dice qué generó la IA y qué cambiaste tú (sección «Uso de IA» de la plantilla).
3. **Prueba de explicación.** Quien revisa puede señalar cualquier línea y pedir «explícamela». Si el autor no puede, el PR regresa.
4. **Defensa semanal.** Los miércoles se sortea un PR unido y su autor lo explica sin notas.
5. **Fuente primaria.** Si la IA usa una función o librería que no conoces, verifica en la documentación oficial (Django, DRF, React) y pon el enlace en el PR. La IA a veces inventa funciones que no existen.
6. **Tus palabras.** Las notas de `06-conceptos/` se escriben sin IA. Si no puedes explicarlo sin ayuda, todavía no lo entiendes; esa nota es tu evidencia.

## Cómo pedirle ayuda a la IA (buenas preguntas)

| En lugar de… | Pregunta… |
| --- | --- |
| «Hazme el endpoint de citas» | «Tengo este plan para `POST /api/citas`. ¿Qué caso límite me falta?» |
| «Arregla este error» | «¿Qué significa este traceback y en qué línea se origina?» |
| «Escribe las pruebas» | «Estos son mis casos de prueba para RN-01. ¿Cuál falta?» |
| «¿Qué uso para la autenticación?» | «Compárame sesión de Django y JWT para nuestro caso; yo escribo el ADR» |

## Firmas

| Integrante | Fecha |
| --- | --- |
| Miguel | |
| [Integrante 2] | |
| [Integrante 3] | |
