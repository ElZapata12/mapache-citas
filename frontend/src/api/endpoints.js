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