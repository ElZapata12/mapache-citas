---
spec: S-001
titulo: Agendar cita sin empalmes
estado: Borrador de ejemplo
responsable: "[nombre]"
revisor: "[nombre]"
sprint: 1
rf: [RF-05, RF-06]
rn: [RN-01, RN-02, RN-03, RN-04, RN-06, RN-08]
pantallas: [P03]
---

# S-001 · Agendar cita sin empalmes

> **Ejemplo de referencia.** Esta spec está escrita para que vean el nivel de detalle esperado. Léanla en equipo, corrijan lo que no les convenza y háganla suya. Las demás specs las escriben ustedes con la [plantilla](../_plantillas/spec.md).

## 1. Problema y objetivo

Hoy dos clientes pueden quedar con el mismo barbero a la misma hora porque la agenda es de papel. **Objetivo:** que recepción agende una cita en menos de 1 minuto y que el sistema haga imposible un empalme.

**Historia de usuario.** Como recepcionista, quiero agendar una cita eligiendo cliente, servicio, barbero, fecha y hora libre, para no empalmar clientes y no hacer cuentas de horarios a mano.

## 2. Criterios de aceptación

Cada criterio se convierte en al menos una prueba automática.

| ID | Dado | Cuando | Entonces | Regla |
| --- | --- | --- | --- | --- |
| CA-01 | Luis está libre de 14:00 a 15:00 el viernes | Recepción agenda «Corte + barba» (60 min, $250) a las 14:00 | Se crea la cita **programada** de 14:00 a 15:00 con `costo_cobrado = 250.00` | RN-02, RN-06 |
| CA-02 | Luis tiene una cita de 13:00 a 13:30 | Se intenta agendar con él a las 13:15 un servicio de 30 min | La API responde **409 HORARIO_OCUPADO** y no se crea nada | RN-01 |
| CA-03 | Luis tiene una cita de 13:00 a 13:30 | Se agenda con él a las 13:30 | Se permite: terminar y empezar a la misma hora no es empalme | RN-01 |
| CA-04 | Diego tiene una cita **cancelada** de 14:00 a 14:45 | Se agenda con él a las 14:00 | Se permite: las canceladas no ocupan horario | RN-01 |
| CA-05 | Luis está ocupado a las 13:00 | Se agenda con **Toño** a las 13:00 | Se permite: el empalme es por barbero | RN-01 |
| CA-06 | Un servicio de 60 min | Se intenta agendar a las 19:30, o en domingo | Responde **400** con el motivo: fuera del horario | RN-03 |
| CA-07 | Hoy son las 12:10 | Se intenta agendar hoy a las 11:00 | Responde **400**: no se agendan citas en el pasado | RN-04 |
| CA-08 | Beto está inactivo | Se intenta agendar con él | Responde **400**; además, Beto no aparece en la lista de barberos de P03 | RN-08 |
| CA-09 | Una cita agendada a $250 | El administrador sube el servicio a $280 | La cita conserva `costo_cobrado = 250.00` | RN-06 |
| CA-10 | Dos recepcionistas eligen a Luis a las 14:00 | Ambas guardan casi al mismo tiempo | Solo una cita se crea; la otra recibe **409** | RN-01 |

## 3. Fuera de alcance

- Varios servicios en una misma cita: un combo como «Corte + barba» se da de alta como un servicio aparte.
- Reserva en línea por parte del cliente.
- Recordatorio por WhatsApp (va en S-009).

## 4. Diseño

- Pantalla **P03 · Nueva cita** y su estado **P03 · Error horario ocupado** en Figma.
- La lista de horarios solo muestra horas donde cabe el servicio completo.

## 5. Contrato de API

**Horarios libres**

```http
GET /api/disponibilidad?fecha=2026-09-25&barbero=1&servicio=3
```

```json
{ "horarios": ["13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00"] }
```

**Crear cita**

```http
POST /api/citas
```

```json
{
  "cliente": 12,
  "barbero": 1,
  "servicio": 3,
  "fecha": "2026-09-25",
  "hora_inicio": "14:00",
  "notas": ""
}
```

Respuesta **201**:

```json
{
  "id": 142,
  "cliente": 12,
  "barbero": 1,
  "servicio": 3,
  "fecha": "2026-09-25",
  "hora_inicio": "14:00",
  "hora_fin": "15:00",
  "costo_cobrado": "250.00",
  "estado": "programada",
  "notas": ""
}
```

Respuesta **409**:

```json
{ "error": { "codigo": "HORARIO_OCUPADO", "mensaje": "Luis Hernández ya tiene una cita de 14:00 a 14:30." } }
```

Respuesta **400**:

```json
{ "error": { "codigo": "VALIDACION", "campos": { "hora_inicio": ["Fuera del horario de la barbería."] } } }
```

## 6. Plan técnico (lo completa quien implementa, antes de programar)

Respondan estas preguntas aquí mismo, en sus palabras. Pueden consultar a Claudian con `/explicame`, pero la respuesta escrita es suya.

1. ¿En qué archivo viven las validaciones RN-01 a RN-04 y por qué ahí y no en el serializer ni en la vista?
2. ¿Cómo se declara la `ExclusionConstraint` en el modelo y qué extensión de PostgreSQL necesita?
3. Si la base de datos rechaza la cita por la restricción, ¿qué excepción llega a Django y cómo se convierte en un 409?
4. Escriban en pseudocódigo el cálculo de horarios libres antes de programarlo.
5. ¿Qué tres pruebas escribirán primero y por qué esas?

## 7. Tareas

- [ ] Modelo `Cita` con su migración y la restricción de no traslape.
- [ ] Función `crear_cita()` en `citas/services.py` con pruebas de CA-01 a CA-09.
- [ ] Prueba de concurrencia CA-10.
- [ ] Endpoint `POST /api/citas` con el formato de error acordado.
- [ ] Endpoint `GET /api/disponibilidad`.
- [ ] Pantalla P03 conectada a la API, incluido el estado de error 409.
- [ ] Prueba de punta a punta del flujo «agendar cita».

## 8. Preguntas abiertas

- ¿Se permite agendar una cita que empieza en menos de 15 minutos?
- ¿Recepción puede elegir «cualquier barbero disponible»? (Por ahora no.)

## 9. Historial

| Fecha | Cambio | Quién |
| --- | --- | --- |
| 2026-10-02 | Borrador de ejemplo creado | Equipo |
