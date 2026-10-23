import { useEffect, useState } from 'react'
import { actualizarServicio, crearServicio, listarServicios } from '../api/endpoints.js'
import { dinero } from '../utils/fechas.js'

export default function Servicios() {
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Formulario nuevo servicio
  const [nuevo, setNuevo] = useState({ descripcion: '', duracion_minutos: 30, precio: '' })
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    listarServicios()
      .then((data) => setServicios(data))
      .catch((e) => setError(e.message || 'No se pudieron cargar los servicios.'))
      .finally(() => setCargando(false))
  }, [])

  async function handleToggleActivo(servicio) {
    const estadoNuevo = !servicio.activo
    try {
      await actualizarServicio(servicio.id, { activo: estadoNuevo })
      setServicios((prev) =>
        prev.map((s) => (s.id === servicio.id ? { ...s, activo: estadoNuevo } : s))
      )
    } catch (e) {
      alert('Error al actualizar estado del servicio: ' + e.message)
    }
  }

  async function handleGuardarServicio(e) {
    e.preventDefault()
    setGuardando(true)
    setAviso('')
    try {
      const creado = await crearServicio({
        descripcion: nuevo.descripcion,
        duracion_minutos: Number(nuevo.duracion_minutos),
        precio: Number(nuevo.precio),
      })
      setServicios((prev) => [...prev, creado])
      setNuevo({ descripcion: '', duracion_minutos: 30, precio: '' })
      setAviso('Servicio registrado correctamente.')
    } catch (e) {
      setAviso(e.message || 'Error al guardar el servicio.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <h1>Servicios</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>
        La duración define cuánto bloquea la agenda; el costo se copia a cada cita al agendar.
      </p>

      {cargando && <p className="vacio">Cargando catálogo...</p>}
      {error && <p className="error">{error}</p>}

      {!cargando && !error && (
        <div className="fila" style={{ alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
          {/* Tabla de servicios */}
          <div className="tarjeta" style={{ flex: '2 1 400px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '8px' }}>DESCRIPCIÓN</th>
                  <th style={{ padding: '8px' }}>DURACIÓN</th>
                  <th style={{ padding: '8px' }}>COSTO</th>
                  <th style={{ padding: '8px' }}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 8px' }}><strong>{s.descripcion || s.nombre}</strong></td>
                    <td style={{ padding: '12px 8px' }}>{s.duracion_minutos} min</td>
                    <td style={{ padding: '12px 8px' }}>{dinero(s.precio || s.costo)}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleActivo(s)}
                        className="boton"
                        style={{
                          backgroundColor: s.activo ? '#e6f4ea' : '#f1f3f4',
                          color: s.activo ? '#137333' : '#5f6368',
                          border: 'none',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {s.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulario nuevo servicio */}
          <form className="tarjeta" onSubmit={handleGuardarServicio} style={{ flex: '1 1 280px', display: 'grid', gap: '12px' }}>
            <h2>Nuevo servicio</h2>
            <div className="campo">
              <label htmlFor="descripcion">Descripción</label>
              <input
                id="descripcion"
                type="text"
                value={nuevo.descripcion}
                onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
                placeholder="Ej. Corte con navaja"
                required
              />
            </div>

            <div className="fila" style={{ gap: '12px' }}>
              <div className="campo" style={{ flex: 1 }}>
                <label htmlFor="duracion">Duración</label>
                <select
                  id="duracion"
                  value={nuevo.duracion_minutos}
                  onChange={(e) => setNuevo({ ...nuevo, duracion_minutos: e.target.value })}
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                </select>
              </div>

              <div className="campo" style={{ flex: 1 }}>
                <label htmlFor="precio">Costo (MXN)</label>
                <input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={nuevo.precio}
                  onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
                  placeholder="$0.00"
                  required
                />
              </div>
            </div>

            {aviso && <p className="vacio" style={{ fontSize: '0.9em' }}>{aviso}</p>}

            <button type="submit" disabled={guardando} className="boton boton--primario">
              {guardando ? 'Guardando...' : 'Guardar servicio'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}