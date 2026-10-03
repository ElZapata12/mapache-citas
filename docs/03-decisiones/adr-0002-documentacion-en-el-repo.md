---
adr: 0002
titulo: El vault de Obsidian vive dentro del repositorio
estado: Propuesto
fecha: 2026-10-02
decisores: [equipo completo]
---

# ADR-0002 · El vault de Obsidian vive dentro del repositorio

## Contexto

- Queremos un registro histórico de lo que hacemos que Claudian pueda consultar.
- Somos 3: todos deben poder leer y escribir ese registro, no solo quien tiene Obsidian.
- Una documentación separada del código tiende a quedarse vieja.

## Opciones evaluadas

| Opción | A favor | En contra |
| --- | --- | --- |
| Vault personal de Obsidian | Rápido de empezar | Vive en una sola computadora; los demás no lo ven; se separa del código |
| Vault sincronizado con un servicio de pago | Todos lo ven | Costo; historial y código siguen separados |
| **Vault en `docs/` del repositorio** | Mismo historial que el código; revisión por PR; se lee en GitHub sin Obsidian | Requiere usar Git para documentar |
| Wiki de GitHub | Integrada a GitHub | No se revisa por PR; Claudian no la lee localmente |

## Decisión

El vault es la carpeta `docs/` del repositorio («documentación como código»). Quien use Obsidian abre `docs/` como vault; quien no, la lee y edita en GitHub o en su editor.

Reglas para que funcione en ambos mundos:

- **Enlaces Markdown relativos**, no `[[wikilinks]]`, para que también funcionen en GitHub (ya configurado en `.obsidian/app.json`).
- Nombres de archivo en minúsculas y con guiones, sin espacios ni acentos.
- Los cambios al vault van por PR, igual que el código.
- Se versiona la configuración compartida de `.obsidian/` y se ignora la personal (`workspace.json`).

## Consecuencias

- La historia del proyecto es `git log`: se ve quién decidió qué y cuándo.
- Claudian, abierto en `docs/`, lee el vault y `CLAUDE.md`; puede leer el código en `../backend` y `../frontend` cuando se lo pidan.
- Documentar se vuelve parte de la definición de terminado, no una tarea al final.
