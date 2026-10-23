import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/sesion.js'
import { cerrarSesion } from '../api/endpoints.js'

export default function Layout() {
  const { usuario, setUsuario } = useSesion()
  const navigate = useNavigate()

  async function handleSalir() {
    try {
      await cerrarSesion()
    } catch {
      // Ignorar error de red al cerrar sesión
    }
    setUsuario(null)
    navigate('/login')
  }

  return (
    <div className="layout-contenedor" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Barra Lateral */}
      <aside style={{ width: '260px', background: '#1a1a1a', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2>El Mapache Bigotón</h2>
          
          <div style={{ marginTop: '30px' }}>
            <p style={{ fontSize: '0.8em', color: '#888', textTransform: 'uppercase' }}>Operación</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '8px', marginTop: '8px' }}>
              <li>
                <Link to="/agenda" style={{ color: '#fff', textDecoration: 'none' }}>Agenda</Link>
              </li>
              {/* Clientes solo para admin y recepcion */}
              {usuario?.rol !== 'barbero' && (
                <li>
                  <Link to="/clientes" style={{ color: '#fff', textDecoration: 'none' }}>Clientes</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Sección de Administración: SOLO para ADMIN */}
          {usuario?.rol === 'admin' && (
            <div style={{ marginTop: '30px' }}>
              <p style={{ fontSize: '0.8em', color: '#888', textTransform: 'uppercase' }}>Administración</p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '8px', marginTop: '8px' }}>
                <li>
                  <Link to="/barberos" style={{ color: '#fff', textDecoration: 'none' }}>Barberos</Link>
                </li>
                <li>
                  <Link to="/servicios" style={{ color: '#fff', textDecoration: 'none' }}>Servicios</Link>
                </li>
                <li>
                  <Link to="/resumen" style={{ color: '#fff', textDecoration: 'none' }}>Resumen del día</Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div>
          <div style={{ marginBottom: '12px', fontSize: '0.9em' }}>
            <strong>{usuario?.nombre}</strong>
            <br />
            <small style={{ color: '#aaa', textTransform: 'capitalize' }}>{usuario?.rol}</small>
          </div>
          <button onClick={handleSalir} className="boton" style={{ width: '100%', background: '#333', color: '#fff' }}>
            Salir
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main style={{ flex: 1, padding: '40px', background: '#fcfbfa', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}