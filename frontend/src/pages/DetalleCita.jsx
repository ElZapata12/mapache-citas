import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerCita, cancelarCita } from '../api/endpoints.js'
import { hora, dinero } from '../utils/formato.js'
import ChipEstado from '../components/ChipEstado.jsx'

export default function DetalleCita() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cita, setCita] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    obtenerCita(id)
      .then((data) => {
        setCita(data)
        setCargando(false)
      })
      .catch((err) => {
        setError(err.message || 'No se pudo cargar la cita.')
        setCargando(false)
      })
  }, [id])

  async function handleCancelar() {
    if (!window.confirm('¿Estás seguro de cancelar esta cita?')) return
    try {
      await cancelarCita(id)
      const actualizada = await obtenerCita(id)
      setCita(actualizada)
    } catch (err) {
      alert(err.message || 'Error al cancelar la cita')
    }
  }

  if (cargando) return <p>Cargando detalles...</p>
  if (error) return <p className="error">{error}</p>
  if (!cita) return <p className="vacio">Cita no encontrada.</p>

  return (
    <>
      <h1>Detalle de la cita</h1>
      <section className="tarjeta" style={{ display: 'grid', gap: 16, maxWidth: 600 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Cita #{cita.id}</h2>
          <ChipEstado estado={cita.estado} />
        </div>

        <div className="campo">
          <strong>Cliente:</strong> {cita.cliente_nombre} ({cita.cliente_telefono})
        </div>

        <div className="campo">
          <strong>Barbero:</strong> {cita.barbero_nombre}
        </div>

        <div className="campo">
          <strong>Fecha y Hora:</strong> {new Date(cita.fecha_hora).toLocaleDateString()} a las {hora(cita.fecha_hora)}
        </div>

        <div className="campo">
          <strong>Servicios:</strong>
          <ul>
            {cita.servicios?.map((s, idx) => (
              <li key={idx}>{s.nombre} - {dinero(s.precio)} ({s.duracion_minutos} min)</li>
            ))}
          </ul>
        </div>

        <div className="campo">
          <strong>Total:</strong> {dinero(cita.total)}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="button" className="boton" onClick={() => navigate('/agenda')}>
            Volver a la agenda
          </button>
          {cita.estado !== 'cancelada' && (
            <button type="button" className="boton" style={{ background: '#dc3545', color: 'white' }} onClick={handleCancelar}>
              Cancelar cita
            </button>
          )}
        </div>
      </section>
    </>
  )
}