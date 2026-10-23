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

// Citas
export const listarCitas = (fecha) => api(`/citas/?fecha=${fecha}`)
export const crearCita = (datos) => api('/citas/', { metodo: 'POST', datos })
export const horariosDisponibles = ({ barbero, fecha, servicios }) => {
  const params = new URLSearchParams({ barbero, fecha })
  servicios.forEach((id) => params.append('servicios', id))
  return api(`/disponibilidad/?${params}`)
}
