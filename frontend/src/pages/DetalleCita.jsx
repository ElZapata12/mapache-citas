import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cambiarEstado, obtenerCita } from '../api/endpoints.js'
import ChipEstado from '../components/ChipEstado.jsx'
import { dinero, hora } from '../utils/fechas.js'

export default function DetalleCita() {
  const { id } = useParams() // el número que viene en la URL: /citas/12
  // Guardamos a qué cita pertenece lo cargado; si no coincide con la URL, todavía está cargando.
  const [resultado, setResultado] = useState({ id: null, cita: null, error: '' })
  const [errorAccion, setErrorAccion] = useState('')

  useEffect(() => {
    let vigente = true
    obtenerCita(id)
      .then((cita) => vigente && setResultado({ id, cita, error: '' }))
      .catch((e) => vigente && setResultado({ id, cita: null, error: e.message }))
    return () => {
      vigente = false
    }
  }, [id])

  async function cambiar(estado) {
    setErrorAccion('')
    try {
      const actualizada = await cambiarEstado(id, estado)
      setResultado({ id, cita: actualizada, error: '' })
    } catch (e) {
      setErrorAccion(e.message)
    }
  }

  if (resultado.id !== id) return <p className="vacio">Cargando…</p>
  if (resultado.error) {
    return (
      <>
        <Link to="/agenda">← Agenda</Link>
        <p className="error">{resultado.error}</p>
      </>
    )
  }

  const { cita } = resultado
  const mensaje = `Hola ${cita.cliente_nombre}, te esperamos a las ${hora(cita.inicio)} en El Mapache Bigotón con ${cita.barbero_nombre}.`
  const whatsapp = `https://wa.me/52${cita.cliente_telefono}?text=${encodeURIComponent(mensaje)}`

  return (
    <>
      <Link to={`/agenda?fecha=${cita.inicio.slice(0, 10)}`}>← Agenda</Link>
      <div className="fila">
        <h1>{cita.cliente_nombre}</h1>
        <ChipEstado estado={cita.estado} />
      </div>

      <section className="tarjeta" style={{ display: 'grid', gap: 8 }}>
        <span>Cita #{cita.id} · {cita.inicio.slice(0, 10)}</span>
        <span>Barbero: <strong>{cita.barbero_nombre}</strong></span>
        <span>Hora: <strong>{hora(cita.inicio)} – {hora(cita.fin)}</strong></span>
        <span>Servicios: {cita.servicios.map((s) => `${s.descripcion} (${dinero(s.costo_cobrado)})`).join(', ')}</span>
        <span>Total: <strong>{dinero(cita.total)}</strong></span>
        <span>Teléfono: {cita.cliente_telefono}</span>
        <a href={whatsapp} target="_blank" rel="noreferrer">Enviar recordatorio por WhatsApp</a>
      </section>

      {cita.estado === 'programada' && (
        <div className="fila">
          <button className="boton boton--primario" onClick={() => cambiar('atendida')}>Marcar atendida</button>
          <button className="boton" onClick={() => cambiar('no_asistio')}>No asistió</button>
          <button className="boton boton--peligro" onClick={() => cambiar('cancelada')}>Cancelar cita</button>
        </div>
      )}
      {errorAccion && <p className="error" role="alert">{errorAccion}</p>}
    </>
  )
}
