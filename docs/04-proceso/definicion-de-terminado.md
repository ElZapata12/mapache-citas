# Definición de listo y de terminado

Dos listas que evitan discusiones: una dice cuándo algo **puede empezar** y la otra cuándo está **terminado**.

## Definición de listo (antes de pasar a «Listo»)

Una spec o tarea puede empezarse cuando:

- [ ] La spec está en estado **Revisada**: la revisó otro integrante y pasó por `/revisar-spec`.
- [ ] Cada criterio de aceptación es verificable (Dado / Cuando / Entonces, con datos concretos).
- [ ] Las pantallas que toca están marcadas «Listo para desarrollo» en Figma.
- [ ] El contrato de API (petición, respuesta y errores) está escrito en la spec.
- [ ] Las tareas duran máximo 1 día cada una.
- [ ] No depende de algo que todavía no existe, o esa dependencia ya está en el sprint.

## Definición de terminado (antes de pasar a «Terminado»)

- [ ] Entró a `main` por un PR aprobado por otro integrante.
- [ ] Las pruebas de sus criterios de aceptación existen y pasan en la integración continua.
- [ ] El linter no marca errores.
- [ ] El autor puede explicar cada línea (contrato de IA, regla 3).
- [ ] Funciona en la máquina de **otro** integrante, no solo en la del autor.
- [ ] La spec está actualizada: estado, historial y respuestas del plan técnico.
- [ ] Si apareció un concepto nuevo, hay una nota en `06-conceptos/`.
- [ ] Si hubo una decisión técnica, hay un ADR.
