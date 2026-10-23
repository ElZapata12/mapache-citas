import { useEffect, useState } from 'react'
import { resumenDelDia } from '../api/endpoints.js'
import { dinero, hoyISO } from '../utils/fechas.js'

export default function Resumen() {
  const [fecha, setFecha] = useState(hoyISO())
  // Guardamos para qué fecha son los datos; si no coincide con la elegida, está cargando.
  const [resultado, setResultado] = useState({ fecha: null, datos: null, error: '' })

  useEffect(() => {
    let vigente = true
    resumenDelDia(fecha)
      .then((datos) => vigente && setResultado({ fecha, datos, error: '' }))
      .catch((e) => vigente && setResultado({ fecha, datos: null, error: e.message }))
    return () => {
      vigente = false
    }
  }, [fecha])

  const cargando = resultado.fecha !== fecha
  const { datos, error } = resultado

  return (
    <>
      <div className="fila" style={{ justifyContent: 'space-between' }}>
        <h1>Resumen del día</h1>
        <input
          type="date"
          aria-label="Fecha"
          className="boton"
          value={fecha}
          onChange={(e) => e.target.value && setFecha(e.target.value)}
        />
      </div>

      {cargando && <p className="vacio">Cargando…</p>}
      {!cargando && error && <p className="error">{error}</p>}

      {!cargando && datos && (
        <>
          <div className="fila">
            <div className="tarjeta"><span className="vacio">Citas</span><h2>{datos.total_citas}</h2></div>
            <div className="tarjeta"><span className="vacio">Atendidas</span><h2>{datos.por_estado.atendida}</h2></div>
            <div className="tarjeta"><span className="vacio">Canceladas</span><h2>{datos.por_estado.cancelada}</h2></div>
            <div className="tarjeta"><span className="vacio">No asistieron</span><h2>{datos.por_estado.no_asistio}</h2></div>
            <div className="tarjeta"><span className="vacio">Cobrado (solo atendidas)</span><h2>{dinero(datos.cobrado)}</h2></div>
          </div>

          <section className="tarjeta">
            <h2>Por barbero</h2>
            <table>
              <thead><tr><th>Barbero</th><th>Citas</th><th>Atendidas</th><th>Cobrado</th></tr></thead>
              <tbody>
                {datos.por_barbero.map((f) => (
                  <tr key={f.barbero}><td>{f.barbero}</td><td>{f.citas}</td><td>{f.atendidas}</td><td>{dinero(f.cobrado)}</td></tr>
                ))}
              </tbody>
            </table>
            {datos.por_barbero.length === 0 && <p className="vacio">No hay citas este día.</p>}
          </section>

          <section className="tarjeta">
            <h2>Por servicio</h2>
            <table>
              <thead><tr><th>Servicio</th><th>Veces</th><th>Cobrado</th></tr></thead>
              <tbody>
                {datos.por_servicio.map((f) => (
                  <tr key={f.servicio}><td>{f.servicio}</td><td>{f.veces}</td><td>{dinero(f.cobrado)}</td></tr>
                ))}
              </tbody>
            </table>
            {datos.por_servicio.length === 0 && <p className="vacio">Ninguna cita atendida este día.</p>}
          </section>
        </>
      )}
    </>
  )
}
