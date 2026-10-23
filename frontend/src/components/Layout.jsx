import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="layout">
      <nav className="menu" aria-label="Menú principal">
        <span className="menu__marca">El Mapache Bigotón</span>
        <NavLink to="/agenda">Agenda</NavLink>
        <NavLink to="/citas/nueva">Nueva cita</NavLink>
        <NavLink to="/clientes">Clientes</NavLink>
        <NavLink to="/resumen">Resumen del día</NavLink>
      </nav>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  )
}
