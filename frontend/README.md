# Frontend · Interfaz de MapacheCitas

Aplicación web en React que usan recepción, el administrador y los barberos. Muestra la información y la envía a la API; las reglas del negocio las valida el backend.

## Tecnologías

- React con Vite
- Diseño basado en Figma

## Pantallas

| ID | Pantalla | Quién la usa |
| --- | --- | --- |
| P01 | Inicio de sesión | Todos |
| P02 | Agenda del día por barbero | Recepción, administrador |
| P03 | Nueva cita y reprogramar | Recepción |
| P04 | Detalle de cita y cambio de estado | Recepción, barbero |
| P05 | Lista y búsqueda de clientes | Recepción |
| P06 | Alta de cliente | Recepción |
| P07 | Barberos | Administrador |
| P08 | Servicios | Administrador |
| P09 | Mi agenda (celular) | Barbero |
| P10 | Resumen del día | Administrador |

## Reglas de diseño

- Funciona en celular (desde 360 px) y en escritorio (hasta 1440 px).
- Cada estado de cita tiene un color fijo y siempre se muestra con su nombre: programada (azul), atendida (verde), cancelada (gris), no asistió (rojo).
- Cada pantalla contempla sus estados: cargando, vacío, error y éxito.
- Si la API responde que el horario está ocupado, se muestra el mensaje sin borrar lo que el usuario ya capturó.

## Organización del código (planeada)

```text
src/
├── pages/        Una carpeta por pantalla (P01 a P10)
├── components/   Piezas reutilizables: botón, chip de estado, tarjeta de cita
└── api/          Funciones que llaman a la API
```

## Cómo correrlo

Pendiente: se documenta cuando se cree el proyecto de React.