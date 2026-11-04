import { api } from './cliente.js'

export const iniciarSesion = (username, password) =>
  api('/auth/login/', { metodo: 'POST', datos: { username, password } })
export const cerrarSesion = () => api('/auth/logout/', { metodo: 'POST' })
export const obtenerYo = () => api('/auth/yo/')

// Catálogo
export const listarBarberos = (sucursal) => api(sucursal ? `/barberos/?sucursal=${sucursal}` : '/barberos/')
export const listarServicios = () => api('/servicios/')

// Sucursales
export const listarSucursales = (incluirInactivas = false) =>
  api(`/sucursales/${incluirInactivas ? '?incluir_inactivas=1' : ''}`)
export const crearSucursal = (datos) => api('/sucursales/', { metodo: 'POST', datos })
export const actualizarSucursal = (id, datos) => api(`/sucursales/${id}/`, { metodo: 'PATCH', datos })

// Clientes
export const buscarClientes = (q = '') => api(`/clientes/?q=${encodeURIComponent(q)}`)
export const crearCliente = (datos) => api('/clientes/', { metodo: 'POST', datos })

// Citas
export const listarCitas = (fecha, sucursal) =>
  api(`/citas/?fecha=${fecha}${sucursal ? `&sucursal=${sucursal}` : ''}`)
export const obtenerCita = (id) => api(`/citas/${id}/`)
export const crearCita = (datos) => api('/citas/', { metodo: 'POST', datos })
export const cambiarEstado = (id, estado) =>
  api(`/citas/${id}/estado/`, { metodo: 'PATCH', datos: { estado } })
export const horariosDisponibles = ({ barbero, fecha, servicios }) => {
  const params = new URLSearchParams({ barbero, fecha })
  servicios.forEach((id) => params.append('servicios', id))
  return api(`/disponibilidad/?${params}`)
}

// Reportes
export const resumenDelDia = (fecha, sucursal) =>
  api(`/reportes/dia/?fecha=${fecha}${sucursal ? `&sucursal=${sucursal}` : ''}`)
