# Cómo contribuir a MapacheCitas

Esta guía explica cómo trabajamos en equipo. Léela antes de hacer tu primer cambio y regresa a ella cuando tengas dudas.

## Antes de empezar (solo la primera vez)

1. Acepta la invitación al repositorio que te llegó por correo de GitHub.
2. Configura tu nombre y correo en Git:

```bash
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu-correo-de-github"
```

3. Descarga el proyecto:

```bash
   git clone https://github.com/ElZapata12/mapache-citas.git
   cd mapache-citas
```

## El ciclo de trabajo

Cada cambio, por pequeño que sea, sigue estos pasos:

```text
tarea → rama → commits → push → pull request → revisión → merge → pull
```

### 1. Toma una tarea

Busca tu tarea en la pestaña **Issues**. Si no existe, pídele al líder que la cree. Fíjate en su número, por ejemplo **#4**.

### 2. Actualízate y crea tu rama

Siempre parte de la versión más nueva de `main`:

```bash
git switch main
git pull
git switch -c feat/agendar-cita
```

Crea la rama **antes** de tocar cualquier archivo.

### 3. Haz tu cambio y guárdalo

```bash
git add ruta/del/archivo
git commit -m "feat(citas): agrega formulario de nueva cita"
```

Haz commits pequeños: es más fácil revisar 3 cambios chicos que uno enorme.

### 4. Sube tu rama

```bash
git push -u origin feat/agendar-cita
```

### 5. Abre el pull request

1. En GitHub, presiona **Compare & pull request**. Si no aparece, ve a **Pull requests → New pull request** y elige tu rama.
2. Revisa que diga `base: main ← compare: tu-rama`.
3. Llena la plantilla completa.
4. En **Reviewers**, elige a un compañero.
5. Presiona **Create pull request**.

### 6. Atiende la revisión

Si tu revisor deja comentarios, haz los cambios en la **misma rama** y vuelve a hacer `git push`. El PR se actualiza solo.

### 7. Une el PR

Cuando esté aprobado:

1. Presiona **Squash and merge** → **Confirm**.
2. Presiona **Delete branch**.

### 8. Actualiza tu computadora

```bash
git switch main
git pull
```

## Convenciones

### Nombres de rama

Formato: `tipo/descripcion-corta`, en minúsculas y con guiones.

| Tipo | Cuándo se usa | Ejemplo |
| --- | --- | --- |
| `feat` | Funcionalidad nueva | `feat/agenda-del-dia` |
| `fix` | Corrección de un error | `fix/empalme-de-citas` |
| `docs` | Documentación | `docs/readme-backend` |
| `test` | Solo pruebas | `test/validacion-telefono` |
| `chore` | Configuración o dependencias | `chore/instalar-django` |

### Mensajes de commit

Formato: `tipo(alcance): qué hace`, en presente y en español.

```text
feat(citas): valida que el barbero no tenga otra cita
fix(clientes): acepta teléfonos con espacios
docs(readme): agrega pasos para correr el proyecto
```

Un buen mensaje permite entender el cambio sin abrir el código.

## Revisar el PR de otro

1. Abre el PR y ve a la pestaña **Files changed**.
2. Lee cada cambio. Si algo no queda claro, da clic en el **+** azul de la línea y pregunta.
3. Comenta con respeto y explica el porqué: «Esto podría fallar si la cita está cancelada, porque…».
4. Si todo está bien: **Review changes → Approve → Submit review**.

## Reglas del equipo

- **Nadie sube cambios directo a `main`.** Así `main` siempre funciona.
- **Nadie aprueba su propio PR.** Otro par de ojos encuentra lo que tú no ves.
- **Una rama por tarea**, y se borra al unirse.
- **Si usaste IA, dilo en el PR.** Usarla está permitido; ocultarlo no.
- **Si no puedes explicar una línea de tu PR, todavía no está listo.**

## ¿Te atoraste?

1. Lee el mensaje de error completo; casi siempre dice qué pasó.
2. Escribe en el grupo del equipo qué comando corriste y qué mensaje salió.
3. Si llevas más de 30 minutos atorado, pide ayuda. No es fallar: es trabajar en equipo.