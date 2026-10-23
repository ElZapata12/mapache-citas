import { useEffect, useState } from 'react'
import { listarCitas } from '../api/endpoints.js'
import { hoyISO, hora, dinero } from '../utils/fechas.js'
import ChipEstado from '../components/ChipEstado.jsx'

export default function Resumen() {
  const [citas, setCitas] = useState([])
  const [fecha, setFecha] = useState(hoyISO())
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vigente = true
    listarCitas({ fecha })
      .then((res) => {
        if (!vigente) return
        setCitas(res)
        setCargando(false)
      })
      .catch(() => {
        if (!vigente) return
        setCitas([])
        setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [fecha])

  const totalDia = citas.reduce((acc, c) => acc + Number(c.total || 0), 0)

  return (
    <>
      <h1>Resumen del día</h1>
      
      <div className="tarjeta" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div className="campo" style={{ margin: 0 }}>
          <label htmlFor="fecha-resumen">Fecha a consultar</label>
          <input 
            type="date" 
            id="fecha-resumen" 
            value={fecha} 
            onChange={(e) => {
              setFecha(e.target.value)
              setCargando(true)
            }} 
          />
        </div>
        <div>
          <strong>Ingresos totales: </strong>
          <span style={{ fontSize: '1.2rem', color: '#28a745', fontWeight: 'bold' }}>{dinero(totalDia)}</span>
        </div>
      </div>

      <section className="tarjeta">
        <h2>Citas programadas</h2>
        {cargando ? (
          <p>Cargando resumen...</p>
        ) : citas.length === 0 ? (
          <p className="vacio">No hay citas registradas para esta fecha.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Barbero</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.id}>
                  <td>{hora(c.fecha_hora)}</td>
                  <td>{c.cliente_nombre}</td>
                  <td>{c.barbero_nombre}</td>
                  <td><ChipEstado estado={c.estado} /></td>
                  <td>{dinero(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  )
}