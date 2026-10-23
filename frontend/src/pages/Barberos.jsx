import { useEffect, useState } from 'react'
import { actualizarBarbero, crearBarbero, listarBarberos } from '../api/endpoints.js'

export default function Barberos() {
  const [barberos, setBarberos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Control para mostrar/ocultar el formulario de registro
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nuevo, setNuevo] = useState({ nombre: '', telefono: '', usuario: '', contraseña: '' })
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    listarBarberos()
      .then((data) => setBarberos(data))
      .catch((e) => setError(e.message || 'No se pudieron cargar los barberos.'))
      .finally(() => setCargando(false))
  }, [])

  async function handleToggleActivo(barbero) {
    const estadoNuevo = !barbero.activo
    try {
      await actualizarBarbero(barbero.id, { activo: estadoNuevo })
      setBarberos((prev) =>
        prev.map((b) => (b.id === barbero.id ? { ...b, activo: estadoNuevo } : b))
      )
    } catch (e) {
      alert('Error al cambiar estado del barbero: ' + e.message)
    }
  }

  async function handleGuardarBarbero(e) {
    e.preventDefault()
    setGuardando(true)
    setAviso('')
    try {
      const creado = await crearBarbero(nuevo)
      setBarberos((prev) => [...prev, creado])
      setNuevo({ nombre: '', telefono: '', usuario: '', contraseña: '' })
      setAviso('Barbero registrado con éxito.')
      setMostrarForm(false)
    } catch (e) {
      setAviso(e.message || 'Error al registrar al barbero.')
    } finally {
      setGuardando(false)
    }
  }

  const activosCount = barberos.filter((b) => b.activo).length
  const inactivosCount = barberos.length - activosCount

  return (
    <>
      <div className="fila" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1>Barberos</h1>
          <span className="vacio">{activosCount} activos · {inactivosCount} inactivos</span>
        </div>
        <button
          type="button"
          onClick={() => setMostrarForm(!mostrarForm)}
          className="boton boton--primario"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo barbero'}
        </button>
      </div>

      {cargando && <p className="vacio">Cargando barberos...</p>}
      {error && <p className="error">{error}</p>}

      {/* Formulario de Alta de Barbero */}
      {mostrarForm && (
        <form className="tarjeta" onSubmit={handleGuardarBarbero} style={{ marginBottom: 24, display: 'grid', gap: 16 }}>
          <h2>Registrar nuevo barbero</h2>
          <div className="fila" style={{ gap: 16, flexWrap: 'wrap' }}>
            <div className="campo" style={{ flex: '1 1 200px' }}>
              <label htmlFor="barbero-nombre">Nombre completo</label>
              <input
                id="barbero-nombre"
                type="text"
                value={nuevo.nombre}
                onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                placeholder="Ej. Luis Hernández"
                required
              />
            </div>
            <div className="campo" style={{ flex: '1 1 200px' }}>
              <label htmlFor="barbero-telefono">Teléfono</label>
              <input
                id="barbero-telefono"
                type="text"
                value={nuevo.telefono}
                onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
                placeholder="55 1111 2233"
              />
            </div>
          </div>

          <div className="fila" style={{ gap: 16, flexWrap: 'wrap' }}>
            <div className="campo" style={{ flex: '1 1 200px' }}>
              <label htmlFor="barbero-usuario">Usuario (opcional para acceso)</label>
              <input
                id="barbero-usuario"
                type="text"
                value={nuevo.usuario}
                onChange={(e) => setNuevo({ ...nuevo, usuario: e.target.value })}
                placeholder="luis.barbero"
              />
            </div>
            <div className="campo" style={{ flex: '1 1 200px' }}>
              <label htmlFor="barbero-password">Contraseña</label>
              <input
                id="barbero-password"
                type="password"
                value={nuevo.contraseña}
                onChange={(e) => setNuevo({ ...nuevo, contraseña: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          {aviso && <p className="error">{aviso}</p>}

          <button type="submit" disabled={guardando} className="boton boton--primario" style={{ justifySelf: 'start' }}>
            {guardando ? 'Guardando...' : 'Guardar barbero'}
          </button>
        </form>
      )}

      {/* Grid de Tarjetas de Barberos */}
      {!cargando && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {barberos.map((b) => (
            <div key={b.id} className="tarjeta" style={{ opacity: b.activo ? 1 : 0.7 }}>
              <div className="fila" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>{b.nombre}</h3>
                  <small style={{ color: '#666' }}>{b.telefono || 'Sin teléfono registrado'}</small>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleActivo(b)}
                  style={{
                    backgroundColor: b.activo ? '#e6f4ea' : '#f1f3f4',
                    color: b.activo ? '#137333' : '#5f6368',
                    border: 'none',
                    padding: '4px 12px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {b.activo ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <span className="vacio" style={{ background: '#f5f5f5', padding: '2px 8px', borderRadius: 4, fontSize: '0.8em' }}>
                  {b.tiene_usuario ? 'Tiene cuenta de acceso' : 'Sin cuenta de acceso'}
                </span>
              </div>

              {!b.activo && (
                <p className="vacio" style={{ fontSize: '0.8em', color: '#888' }}>
                  No aparece al agendar citas nuevas. Su historial de citas se conserva.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}