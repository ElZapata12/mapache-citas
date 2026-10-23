import { Navigate } from 'react-router-dom'
import { useSesion } from '../context/sesion.js'

export default function RutaProtegida({ roles, children }) {
    const { usuario, cargando } = useSesion()
    if (cargando) return <p className="vacio">Cargando…</p>
    if (!usuario) return <Navigate to="/login" replace />
    if (roles && !roles.includes(usuario.rol)) return <Navigate to="/agenda" replace />
    return children
}