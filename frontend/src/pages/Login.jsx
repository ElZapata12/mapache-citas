import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/sesion.js'

export default function Login() {
  const { usuario, entrar } = useSesion()
  const navegar = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to="/agenda" replace />

  async function enviar(evento) {
    evento.preventDefault() // evita que el navegador recargue la página
    setError('')
    setEnviando(true)
    try {
      await entrar(username, password)
      navegar('/agenda')
    } catch {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 16 }}>
      <form className="tarjeta" onSubmit={enviar} style={{ width: 'min(400px, 100%)', display: 'grid', gap: 16 }}>
        <h1>Inicia sesión</h1>
        <div className="campo">
          <label htmlFor="username">Usuario</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </div>
        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="boton boton--primario" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}