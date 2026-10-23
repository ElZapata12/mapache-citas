import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listarCitas } from '../api/endpoints.js'
import ChipEstado from '../components/ChipEstado.jsx'
import { useSesion } from '../context/sesion.js'
import { hora, hoyISO } from '../utils/fechas.js'

export default function Agenda() {
  const { usuario } = useSesion()
  const [params, setParams] = useSearchParams()
  const fecha = params.get('fecha') || hoyISO()
  const [resultado, setResultado] = useState({ fecha: null, citas: [], error: '' })

  useEffect(() => {
    let vigente = true
    listarCitas(fecha)
      .then((citas) => {
        if (vigente) {
          setResultado({ fecha, citas: Array.isArray(citas) ? citas : [], error: '' })
        }
      })
      .catch((e) => {
        if (vigente) {
          setResultado({ fecha, citas: [], error: e.message || 'No se pudieron cargar las citas.' })
        }
      })
    return () => {
      vigente = false
    }
  }, [fecha])

  const cargando = resultado.fecha !== fecha
  const { citas, error } = resultado

  // Agrupa las citas por barbero garantizando un nombre válido
  const porBarbero = {}
  for (const cita of citas) {
    const nombreBarbero = cita.barbero_nombre || cita.barbero || 'Sin barbero asignado'
    porBarbero[nombreBarbero] ??= []
    porBarbero[nombreBarbero].push(cita)
  }

  return (
    <>
      <div className="fila" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Agenda del día</h1>
        <div className="fila" style={{ gap: 10 }}>
          <input
            type="date"
            aria-label="Fecha"
            value={fecha}
            onChange={(e) => e.target.value && setParams({ fecha: e.target.value })}
            className="boton"
          />
          {usuario?.rol !== 'barbero' && (
            <Link className="boton boton--primario" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }} to="/citas/nueva">
              Nueva cita
            </Link>
          )}
        </div>
      </div>

      {cargando && <p className="vacio">Cargando citas…</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && citas.length === 0 && <p className="vacio">No hay citas registradas para este día.</p>}

      <div className="agenda" style={{ display: 'grid', gap: 16 }}>
        {Object.entries(porBarbero).map(([barbero, suyas]) => (
          <section key={barbero} className="tarjeta">
            <h2>{barbero}</h2>
            <span className="vacio">{suyas.length} cita(s)</span>
            <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
              {suyas.map((cita) => (
                <Link 
                  key={cita.id} 
                  to={`/citas/${cita.id}`} 
                  className={`cita cita--${cita.estado}`}
                  style={{ display: 'block', padding: 12, border: '1px solid #ddd', borderRadius: 6, textDecoration: 'none', color: 'inherit' }}
                >
                  <strong>{hora(cita.inicio || cita.fecha_hora)}</strong> · {cita.cliente_nombre || 'Cliente'}
                  <br />
                  <small>
                    {Array.isArray(cita.servicios) 
                      ? cita.servicios.map((s) => typeof s === 'object' ? (s.nombre || s.descripcion) : s).join(' + ')
                      : 'Servicios de la cita'}
                  </small>
                  <br />
                  <div style={{ marginTop: 6 }}>
                    <ChipEstado estado={cita.estado} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}