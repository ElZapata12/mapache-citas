import { Link } from 'react-router-dom';
import ChipEstado from '../components/ChipEstado';

const CitasView = () => {
return (
    <div className="view-container">
    <h2>Gestión de Citas</h2>
    <p>Listado general de todas las citas registradas.</p> 
      {/* Botón para navegar a crear nueva cita */}
    <Link to="/citas/nueva" className="btn-primary">
        + Agendar Nueva Cita
    </Link>

    <ChipEstado estado="pendiente" />
    <ChipEstado estado="confirmada" />
    <ChipEstado estado="cancelada" />

      {/* Ejemplo de lista de citas con enlace a sus detalles */}
    <ul className="citas-list" style={{ marginTop: '20px' }}>
        <li>
        <span>Cita #101 - Cliente: Juan Pérez</span>
        <Link to="/citas/101" style={{ marginLeft: '10px' }}>Ver Detalle</Link>
        </li>
        <li>
        <span>Cita #102 - Cliente: María Gómez</span>
        <Link to="/citas/102" style={{ marginLeft: '10px' }}>Ver Detalle</Link>
        </li>
    </ul>
    
    </div>
    );
};

export default CitasView;