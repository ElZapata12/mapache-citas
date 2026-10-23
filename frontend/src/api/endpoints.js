import { api } from './cliente.js'

// Autenticación
export const iniciarSesion = (username, password) =>
api('/auth/login/', { metodo: 'POST', datos: { username, password } })
export const cerrarSesion = () => api('/auth/logout/', { metodo: 'POST' })
export const obtenerYo = () => api('/auth/yo/')

// Barberos (Admin)
export const listarBarberos = () => api('/barberos/')
export const crearBarbero = (datos) => api('/barberos/', { metodo: 'POST', datos })
export const actualizarBarbero = (id, datos) => api(`/barberos/${id}/`, { metodo: 'PATCH', datos })

// Servicios (Admin)
export const listarServicios = () => api('/servicios/')
export const crearServicio = (datos) => api('/servicios/', { metodo: 'POST', datos })
export const actualizarServicio = (id, datos) => api(`/servicios/${id}/`, { metodo: 'PATCH', datos })

// Clientes
export const buscarClientes = (q = '') => api(`/clientes/?q=${encodeURIComponent(q)}`)
export const crearCliente = (datos) => api('/clientes/', { metodo: 'POST', datos })

// Citas
export const listarCitas = (fecha) => api(`/citas/?fecha=${fecha}`)
export const obtenerCita = (id) => api(`/citas/${id}/`)
export const crearCita = (datos) => api('/citas/', { metodo: 'POST', datos })
export const cancelarCita = (id) => api(`/citas/${id}/cancelar/`, { metodo: 'POST' })
export const horariosDisponibles = ({ barbero, fecha, servicios }) => {
const params = new URLSearchParams({ barbero, fecha })
servicios.forEach((id) => params.append('servicios', id))
return api(`/disponibilidad/?${params}`)
}