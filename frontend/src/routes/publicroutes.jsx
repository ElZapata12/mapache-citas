import Layout from '../components/Layout';
import LoginView from "../views/LoginView";
import AgendaView from "../views/AgendaView";
import NuevaCitaView from "../views/NuevaCitaView";
import CitasView from "../views/CitasView";
import ClientesView from "../views/ClientesView";
import ResumenView from "../views/ResumenView";
import { Routes, Route, Navigate } from "react-router-dom"

const PublicRoutes = () => {
    const isAuth = true;

    return (
        <Routes>
            <Route path="/login" element={!isAuth ? <LoginView /> : <Navigate to="/agenda" replace />} />
            <Route element={<Layout />}>
            <Route path="/agenda" element={<AgendaView />} />
            <Route path="/citas" element={<CitasView />} />
            <Route path="/nueva_Cita" element={<NuevaCitaView />} />
            <Route path="/clientes" element={<ClientesView />} />
            <Route path="/resumen" element={<ResumenView />} />
            </Route>

            <Route path="/" element={<Navigate to={isAuth ? "/agenda" : "/login"}  replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default PublicRoutes;