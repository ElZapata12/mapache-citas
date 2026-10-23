import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
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
      <Route element={<Layout />}>
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/citas/nueva" element={<NuevaCita />} />
        <Route path="/citas/:id" element={<DetalleCita />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/resumen" element={<Resumen />} />
      </Route>
      <Route path="*" element={<Navigate to="/agenda" replace />} />
    </Routes>
  )
}
