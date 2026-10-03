---
adr: 0003
titulo: Spec-Driven Development ligero con sprints de una semana
estado: Propuesto
fecha: 2026-10-02
decisores: [equipo completo]
---

# ADR-0003 · Spec-Driven Development ligero con sprints de una semana

## Contexto

- Todos usamos IA para programar. Sin método, la IA escribe código que nadie entiende del todo («vibe coding»).
- Queremos aprender a liderar y trabajar como un equipo real en 4 a 6 semanas.
- Con 3 personas, un Scrum completo tendría más reuniones que trabajo.

## Opciones evaluadas

| Opción | A favor | En contra |
| --- | --- | --- |
| Programar pidiéndole todo a la IA | Rápido al inicio | Nadie sabe por qué funciona; difícil de mantener y de defender |
| Scrum completo | Conocido en la industria | Demasiadas ceremonias para 3 personas y 5 semanas |
| Spec-Driven Development con herramienta (GitHub Spec Kit) | Fases claras: especificar, planear, dividir, implementar | Genera mucha documentación; críticos lo comparan con un regreso a la cascada |
| **SDD ligero + sprints de una semana** | Humanos definen qué y por qué; la IA ayuda en el cómo; ciclos cortos | Requiere disciplina para escribir specs cortas |

## Decisión

Cada funcionalidad sigue el ciclo **Especificar → Planear → Probar → Construir → Revisar → Aprender** (detalle en [metodología](../04-proceso/metodologia.md)), dentro de sprints de una semana con tablero Kanban en GitHub Projects.

- Las specs son **cortas** (una página) y las escribe una persona del equipo.
- Las fases se hacen a mano con nuestras plantillas. Si después quieren automatizarlas con Spec Kit, ya sabrán qué hace cada paso.
- Las reglas de uso de IA están en el [contrato de IA](../04-proceso/contrato-de-ia.md).

## Consecuencias

- Toda línea de código se rastrea a una spec, y toda spec a un requisito.
- La IA acelera la parte repetitiva; el entendimiento lo demuestra el autor en cada PR.
- Si una spec crece más de una página, se divide.

## Fuentes

- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [Putting Spec Kit Through Its Paces (Scott Logic)](https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html)
