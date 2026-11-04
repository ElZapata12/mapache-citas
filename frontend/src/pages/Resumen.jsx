import { useEffect, useState } from 'react'
import { resumenDelDia } from '../api/endpoints.js'
import SelectorSucursal from '../components/SelectorSucursal.jsx'
import { dinero, hoyISO } from '../utils/fechas.js'

export default function Resumen() {
  const [fecha, setFecha] = useState(hoyISO())
  const [sucursal, setSucursal] = useState('')
  const clave = `${fecha}|${sucursal}`
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: '' })

  useEffect(() => {
    let vigente = true
    resumenDelDia(fecha, sucursal)
      .then((datos) => vigente && setResultado({ clave, datos, error: '' }))
      .catch((e) => vigente && setResultado({ clave, datos: null, error: e.message }))
    return () => {
      vigente = false
    }
  }, [fecha, sucursal, clave])

  const cargando = resultado.clave !== clave
  const { datos, error } = resultado

  return (
    <>
      <div className="fila" style={{ justifyContent: 'space-between' }}>
        <h1>Resumen del día</h1>
        <div className="fila">
          <input
            type="date"
            aria-label="Fecha"
            className="boton"
            value={fecha}
            onChange={(e) => e.target.value && setFecha(e.target.value)}
          />
          <SelectorSucursal valor={sucursal} onCambio={setSucursal} />
        </div>
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

          {!sucursal && (
            <section className="tarjeta">
              <h2>Por sucursal</h2>
              <table>
                <thead><tr><th>Sucursal</th><th>Citas</th><th>Atendidas</th><th>Cobrado</th></tr></thead>
                <tbody>
                  {datos.por_sucursal.map((f) => (
                    <tr key={f.sucursal}><td>{f.sucursal}</td><td>{f.citas}</td><td>{f.atendidas}</td><td>{dinero(f.cobrado)}</td></tr>
                  ))}
                </tbody>
              </table>
              {datos.por_sucursal.length === 0 && <p className="vacio">No hay citas este día.</p>}
            </section>
          )}

          <section className="tarjeta">
            <h2>Por barbero</h2>
            <table>
              <thead><tr><th>Barbero</th><th>Sucursal</th><th>Citas</th><th>Atendidas</th><th>Cobrado</th></tr></thead>
              <tbody>
                {datos.por_barbero.map((f) => (
                  <tr key={`${f.sucursal}-${f.barbero}`}><td>{f.barbero}</td><td>{f.sucursal}</td><td>{f.citas}</td><td>{f.atendidas}</td><td>{dinero(f.cobrado)}</td></tr>
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
