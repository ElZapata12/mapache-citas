import { api } from './cliente.js'

export const iniciarSesion = (username, password) =>
api('/auth/login/', { metodo: 'POST', datos: { username, password } })
export const cerrarSesion = () => api('/auth/logout/', { metodo: 'POST' })
export const obtenerYo = () => api('/auth/yo/')

// Catálogo
export const listarBarberos = () => api('/barberos/')
export const listarServicios = () => api('/servicios/')

// Clientes
export const buscarClientes = (q = '') => api(`/clientes/?q=${encodeURIComponent(q)}`)
export const crearCliente = (datos) => api('/clientes/', { metodo: 'POST', datos })

// Citas (Para Nueva Cita, Detalle y Resumen)
export const listarHorarios = ({ barbero, fecha, servicios }) =>
api(`/citas/horarios/?barbero=${barbero}&fecha=${fecha}&servicios=${servicios}`)
export const crearCita = (datos) => api('/citas/', { metodo: 'POST', datos })
export const obtenerCita = (id) => api(`/citas/${id}/`)
export const cancelarCita = (id) => api(`/citas/${id}/cancelar/`, { metodo: 'POST' })
export const listarCitas = (params = {}) => {
const query = new URLSearchParams(params).toString()
return api(`/citas/${query ? `?${query}` : ''}`)
}