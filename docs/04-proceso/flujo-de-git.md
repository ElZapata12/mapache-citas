# Flujo de Git

Usamos **GitHub Flow**: `main` siempre funciona y todo cambio entra por pull request desde una rama corta.

## Reglas

- `main` está **protegida**: nadie sube directo; se requiere 1 aprobación y la integración continua en verde.
- Una rama por tarea, de vida corta (idealmente menos de 2 días).
- PR pequeños: menos de 400 líneas cambiadas. Si crece, se divide.
- Se une con **squash merge** y se borra la rama.
- Cada PR enlaza su issue (`Cierra #12`) y su spec.

## Nombres de rama

`tipo/spec-descripcion-corta`

| Tipo | Uso | Ejemplo |
| --- | --- | --- |
| `feat` | Funcionalidad nueva | `feat/s-001-crear-cita` |
| `fix` | Corrección de un error | `fix/s-001-empalme-borde` |
| `test` | Solo pruebas | `test/s-001-concurrencia` |
| `docs` | Vault o documentación | `docs/adr-0004-autenticacion` |
| `chore` | Configuración, dependencias, CI | `chore/ci-pytest` |

## Mensajes de commit (Conventional Commits)

`tipo(alcance): descripción en presente`

```text
feat(citas): valida empalmes al crear cita (RN-01)
test(citas): agrega caso de bordes que se tocan (CA-03)
fix(api): devuelve 409 cuando la restricción de BD rechaza la cita
docs(adr): propone autenticación con sesión de Django
```

## El ciclo en comandos

```bash
git switch main
git pull
git switch -c feat/s-001-crear-cita

# trabajar en commits pequeños
git add -p
git commit -m "test(citas): pruebas de CA-01 a CA-03"

git push -u origin feat/s-001-crear-cita
# abrir el PR en GitHub con la plantilla
```

> `git add -p` te muestra cada cambio antes de agregarlo. Es la primera revisión de tu propio código.

## Qué revisa quien revisa

1. ¿El PR cumple los criterios de aceptación que dice cubrir?
2. ¿Hay pruebas y pasan?
3. ¿Entiendo el código? Si no, pregunto. Si el autor tampoco puede explicarlo, el PR regresa.
4. ¿Se actualizó el vault (spec, ADR o concepto) si hacía falta?

Comentarios con amabilidad y con el porqué: «Esto podría fallar si la cita está cancelada, porque…», no «Esto está mal».
