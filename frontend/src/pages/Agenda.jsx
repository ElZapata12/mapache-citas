import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listarCitas } from '../api/endpoints.js'
import ChipEstado from '../components/ChipEstado.jsx'
import { useSesion } from '../context/sesion.js'
import { hora, hoyISO } from '../utils/fechas.js'

export default function Agenda() {
  const { usuario } = useSesion()
  // La fecha vive en la URL (?fecha=...): así se puede recargar o compartir la página.
  const [params, setParams] = useSearchParams()
  const fecha = params.get('fecha') || hoyISO()
  // Guardamos para qué fecha son las citas cargadas. Si no coincide con la fecha elegida, está cargando.
  const [resultado, setResultado] = useState({ fecha: null, citas: [], error: '' })

  useEffect(() => {
    let vigente = true // evita mostrar datos viejos si el usuario cambia de fecha muy rápido
    listarCitas(fecha)
      .then((citas) => vigente && setResultado({ fecha, citas, error: '' }))
      .catch((e) => vigente && setResultado({ fecha, citas: [], error: e.message }))
    return () => {
      vigente = false
    }
  }, [fecha]) // se vuelve a ejecutar cada vez que cambia la fecha

  const cargando = resultado.fecha !== fecha
  const { citas, error } = resultado

  // Agrupa las citas por barbero: { "Luis Hernández": [cita, cita], ... }
  const porBarbero = {}
  for (const cita of citas) {
    porBarbero[cita.barbero_nombre] ??= []
    porBarbero[cita.barbero_nombre].push(cita)
  }

  return (
    <>
      <div className="fila" style={{ justifyContent: 'space-between' }}>
        <h1>Agenda del día</h1>
        <div className="fila">
          <input
            type="date"
            aria-label="Fecha"
            value={fecha}
            onChange={(e) => e.target.value && setParams({ fecha: e.target.value })}
            className="boton"
          />
          {usuario.rol !== 'barbero' && (
            <Link className="boton boton--primario" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }} to="/citas/nueva">
              Nueva cita
            </Link>
          )}
        </div>
      </div>

      {cargando && <p className="vacio">Cargando citas…</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && citas.length === 0 && <p className="vacio">No hay citas este día.</p>}

      <div className="agenda">
        {Object.entries(porBarbero).map(([barbero, suyas]) => (
          <section key={barbero} className="tarjeta">
            <h2>{barbero}</h2>
            <span className="vacio">{suyas.length} citas</span>
            {suyas.map((cita) => (
              <Link key={cita.id} to={`/citas/${cita.id}`} className={`cita cita--${cita.estado}`}>
                <strong>{hora(cita.inicio)}–{hora(cita.fin)}</strong> · {cita.cliente_nombre}
                <br />
                <small>{cita.servicios.map((s) => s.descripcion).join(' + ')}</small>
                <br />
                <ChipEstado estado={cita.estado} />
              </Link>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}
