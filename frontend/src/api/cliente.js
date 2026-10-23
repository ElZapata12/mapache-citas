const LLAVE_TOKEN = 'mapache_token'

export function guardarToken(token) {
    if (token) localStorage.setItem(LLAVE_TOKEN, token)
    else localStorage.removeItem(LLAVE_TOKEN)
}

export function leerToken() {
    return localStorage.getItem(LLAVE_TOKEN)
}

export class ErrorApi extends Error {
    constructor(status, { codigo = 'ERROR', mensaje = 'Algo salió mal.', campos = null } = {}) {
    super(mensaje)
    this.status = status
    this.codigo = codigo
    this.campos = campos
    }
}

export async function api(ruta, { metodo = 'GET', datos } = {}) {
    const encabezados = { 'Content-Type': 'application/json' }
    const token = leerToken()
    if (token) encabezados.Authorization = `Token ${token}`

const respuesta = await fetch(`/api${ruta}`, {
    method: metodo,
    headers: encabezados,
    body: datos ? JSON.stringify(datos) : undefined,
})

if (respuesta.status === 204) return null
    const cuerpo = await respuesta.json().catch(() => ({}))

if (!respuesta.ok) {
    if (respuesta.status === 401) guardarToken(null) // token vencido o borrado
    throw new ErrorApi(respuesta.status, cuerpo.error)
}
    return cuerpo
}