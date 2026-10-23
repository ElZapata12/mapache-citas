import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import Agenda from './pages/Agenda.jsx'
import Clientes from './pages/Clientes.jsx'
import DetalleCita from './pages/DetalleCita.jsx'
import Login from './pages/Login.jsx'
import NuevaCita from './pages/NuevaCita.jsx'
import Resumen from './pages/Resumen.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/citas/:id" element={<DetalleCita />} />
        <Route
          path="/citas/nueva"
          element={<RutaProtegida roles={['admin', 'recepcion']}><NuevaCita /></RutaProtegida>}
        />
        <Route
          path="/clientes"
          element={<RutaProtegida roles={['admin', 'recepcion']}><Clientes /></RutaProtegida>}
        />
        <Route
          path="/resumen"
          element={<RutaProtegida roles={['admin']}><Resumen /></RutaProtegida>}
        />
      </Route>
      <Route path="*" element={<Navigate to="/agenda" replace />} />
    </Routes>
  )
}