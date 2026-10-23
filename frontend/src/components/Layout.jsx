import { NavLink, Outlet } from 'react-router-dom'
import { useSesion } from '../context/sesion.js'

export default function Layout() {
  const { usuario, salir } = useSesion()
  const esAdmin = usuario.rol === 'admin'
  const esBarbero = usuario.rol === 'barbero'

  return (
    <div className="layout">
      <nav className="menu" aria-label="Menú principal">
        <span className="menu__marca">El Mapache Bigotón</span>
        <NavLink to="/agenda">Agenda</NavLink>
        {!esBarbero && <NavLink to="/citas/nueva">Nueva cita</NavLink>}
        {!esBarbero && <NavLink to="/clientes">Clientes</NavLink>}
        {esAdmin && <NavLink to="/resumen">Resumen del día</NavLink>}
        <div className="menu__usuario">
          {usuario.nombre} · {usuario.rol}
          <br />
          <button className="boton" style={{ marginTop: 8 }} onClick={salir}>Salir</button>
        </div>
      </nav>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  )
}