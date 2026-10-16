import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
return (
    <div className="app-layout" style={{ display: 'flex' }}>
      {/* Menú lateral fijo */}
    <aside className="sidebar" style={{ width: '250px', padding: '20px', background: '#f4f4f4' }}>
        <h3>Mi Aplicación</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <Link to="/agenda">📅 Agenda</Link>
        <Link to="/citas">📋 Citas</Link>
        <Link to="/clientes">👥 Clientes</Link>
        <Link to="/resumen">📊 Resumen</Link>
        <Link to="/login" style={{ marginTop: '20px', color: 'red' }}>Cerrar Sesión</Link>
        </nav>
    </aside>

      {/* Contenido dinámico que cambia según la ruta */}
    <main className="main-content" style={{ flex: 1, padding: '20px' }}>
        <Outlet />
    </main>
    </div>
    );
};

export default Layout;