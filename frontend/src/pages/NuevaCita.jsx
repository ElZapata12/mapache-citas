import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  buscarClientes,
  crearCita,
  horariosDisponibles,
  listarBarberos,
  listarServicios,
} from '../api/endpoints.js'
import { dinero, hoyISO } from '../utils/fechas.js'

export default function NuevaCita() {
  const navegar = useNavigate()
  const [barberos, setBarberos] = useState([])
  const [servicios, setServicios] = useState([])

  const [busqueda, setBusqueda] = useState('')
  const [encontrados, setEncontrados] = useState([])
  const [cliente, setCliente] = useState(null)
  const [elegidos, setElegidos] = useState([]) // ids de servicios
  const [barbero, setBarbero] = useState('')
  const [fecha, setFecha] = useState(hoyISO())
  const [disponibles, setDisponibles] = useState({ clave: '', horarios: [] })
  const [recargas, setRecargas] = useState(0)
  const [horaInicio, setHoraInicio] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  // 1. Al abrir la pantalla: trae barberos y servicios activos.
  useEffect(() => {
    listarBarberos().then(setBarberos).catch((e) => setError(e.message))
    listarServicios().then(setServicios).catch((e) => setError(e.message))
  }, [])

  // 2. Cuando ya hay barbero, fecha y servicios: pide los horarios libres.
  //    "clave" resume esos tres datos; si cambia alguno, se piden de nuevo.
  const clave = barbero && fecha && elegidos.length > 0 ? `${barbero}|${fecha}|${elegidos.join(',')}` : ''
  useEffect(() => {
    if (!clave) return
    let vigente = true
    horariosDisponibles({ barbero, fecha, servicios: elegidos })
      .then((r) => vigente && setDisponibles({ clave, horarios: r.horarios }))
      .catch((e) => vigente && setError(e.message))
    return () => {
      vigente = false
    }
  }, [clave, barbero, fecha, elegidos, recargas])
  const horarios = disponibles.clave === clave ? disponibles.horarios : []
  const cargandoHorarios = Boolean(clave) && disponibles.clave !== clave

  async function buscar() {
    setError('')
    try {
      setEncontrados(await buscarClientes(busqueda))
    } catch (e) {
      setError(e.message)
    }
  }

  function alternarServicio(id) {
    setElegidos((actuales) => (actuales.includes(id) ? actuales.filter((x) => x !== id) : [...actuales, id]))
    setHoraInicio('') // si cambian los servicios, la hora elegida puede ya no servir
  }

  const seleccion = servicios.filter((s) => elegidos.includes(s.id))
  const total = seleccion.reduce((suma, s) => suma + Number(s.costo), 0)
  const minutos = seleccion.reduce((suma, s) => suma + s.duracion_min, 0)
  const listo = cliente && barbero && horaInicio && elegidos.length > 0

  async function guardar() {
    setError('')
    setGuardando(true)
    try {
      await crearCita({ cliente: cliente.id, barbero: Number(barbero), servicios: elegidos, fecha, hora_inicio: horaInicio })
      navegar(`/agenda?fecha=${fecha}`)
    } catch (e) {
      // 409 = otra persona ocupó el horario: se avisa y se vuelven a pedir los horarios.
      setError(e.message)
      if (e.status === 409) {
        setHoraInicio('')
        setDisponibles({ clave: '', horarios: [] })
        setRecargas((n) => n + 1)
      }
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <h1>Nueva cita</h1>

      <section className="tarjeta" style={{ display: 'grid', gap: 12 }}>
        <h2>1. Cliente</h2>
        {cliente ? (
          <div className="fila">
            <strong>{cliente.nombre}</strong> · {cliente.telefono}
            <button className="boton" onClick={() => setCliente(null)}>Cambiar</button>
          </div>
        ) : (
          <>
            <div className="fila">
              <div className="campo" style={{ flexGrow: 1 }}>
                <label htmlFor="busqueda">Nombre o teléfono</label>
                <input id="busqueda" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              </div>
              <button className="boton" style={{ alignSelf: 'end' }} onClick={buscar}>Buscar</button>
            </div>
            {encontrados.map((c) => (
              <button key={c.id} className="boton" style={{ justifySelf: 'start' }} onClick={() => setCliente(c)}>
                {c.nombre} · {c.telefono}
              </button>
            ))}
          </>
        )}
      </section>

      <section className="tarjeta" style={{ display: 'grid', gap: 12 }}>
        <h2>2. Servicios</h2>
        <div className="fila">
          {servicios.map((s) => (
            <button
              key={s.id}
              aria-pressed={elegidos.includes(s.id)}
              className={`boton ${elegidos.includes(s.id) ? 'boton--seleccionado' : ''}`}
              onClick={() => alternarServicio(s.id)}
            >
              {s.descripcion} · {s.duracion_min} min · {dinero(s.costo)}
            </button>
          ))}
        </div>
        <span className="vacio">Duración total: {minutos} min · Total: {dinero(total)}</span>
      </section>

      <section className="tarjeta" style={{ display: 'grid', gap: 12 }}>
        <h2>3. Barbero, fecha y hora</h2>
        <div className="fila">
          <div className="campo">
            <label htmlFor="barbero">Barbero</label>
            <select id="barbero" value={barbero} onChange={(e) => { setBarbero(e.target.value); setHoraInicio('') }}>
              <option value="">Elige…</option>
              {barberos.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="fecha">Fecha</label>
            <input id="fecha" type="date" value={fecha} onChange={(e) => { setFecha(e.target.value); setHoraInicio('') }} />
          </div>
        </div>
        {cargandoHorarios && <p className="vacio">Buscando horarios…</p>}
        {clave && !cargandoHorarios && horarios.length === 0 && (
          <p className="vacio">No hay horarios libres. Prueba otro barbero u otra fecha.</p>
        )}
        <div className="horarios">
          {horarios.map((h) => (
            <button key={h} className={`boton ${h === horaInicio ? 'boton--seleccionado' : ''}`} onClick={() => setHoraInicio(h)}>
              {h}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="error" role="alert">{error}</p>}
      <div className="fila" style={{ justifyContent: 'flex-end' }}>
        <button className="boton" onClick={() => navegar('/agenda')}>Cancelar</button>
        <button className="boton boton--primario" disabled={!listo || guardando} onClick={guardar}>
          {guardando ? 'Guardando…' : 'Guardar cita'}
        </button>
      </div>
    </>
  )
}
