import { useEffect, useState } from 'react'
import { guardarToken, leerToken } from '../api/cliente.js'
import { cerrarSesion, iniciarSesion, obtenerYo } from '../api/endpoints.js'
import { SesionContext } from './sesion.js'

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(Boolean(leerToken()))

  // Al abrir la app: si hay un token guardado, pregunta a la API quién es su dueño.
  useEffect(() => {
    if (!leerToken()) return
    obtenerYo()
      .then(setUsuario)
      .catch(() => guardarToken(null))
      .finally(() => setCargando(false))
  }, [])

  async function entrar(username, password) {
    const { token, usuario } = await iniciarSesion(username, password)
    guardarToken(token)
    setUsuario(usuario)
  }

  async function salir() {
    await cerrarSesion().catch(() => {})
    guardarToken(null)
    setUsuario(null)
  }

  return (
    <SesionContext.Provider value={{ usuario, cargando, entrar, salir }}>
      {children}
    </SesionContext.Provider>
  )
}