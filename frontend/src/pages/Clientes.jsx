import { useEffect, useState } from 'react'
import { buscarClientes, crearCliente } from '../api/endpoints.js'

const VACIO = { nombre: '', telefono: '', notas: '' }

export default function Clientes() {
  const [q, setQ] = useState('')
  const [clientes, setClientes] = useState([])
  const [nuevo, setNuevo] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [aviso, setAviso] = useState('')

  // Busca cada vez que cambia el texto (espera 300 ms para no llamar a la API en cada tecla).
  useEffect(() => {
    const espera = setTimeout(() => buscarClientes(q).then(setClientes), 300)
    return () => clearTimeout(espera)
  }, [q])

  async function guardar(evento) {
    evento.preventDefault()
    setErrores({})
    setAviso('')
    try {
      const creado = await crearCliente(nuevo)
      setClientes((lista) => [creado, ...lista])
      setNuevo(VACIO)
      setAviso(`Se registró a ${creado.nombre}.`)
    } catch (e) {
      setErrores(e.campos ?? { general: [e.message] })
    }
  }

  return (
    <>
      <h1>Clientes</h1>
      <div className="fila" style={{ alignItems: 'start' }}>
        <section className="tarjeta" style={{ flex: '2 1 420px' }}>
          <div className="campo">
            <label htmlFor="q">Buscar por nombre o teléfono</label>
            <input id="q" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <table>
            <thead><tr><th>Nombre</th><th>Teléfono</th></tr></thead>
            <tbody>
              {clientes.map((c) => <tr key={c.id}><td>{c.nombre}</td><td>{c.telefono}</td></tr>)}
            </tbody>
          </table>
          {clientes.length === 0 && <p className="vacio">Sin resultados.</p>}
        </section>

        <form className="tarjeta" onSubmit={guardar} style={{ flex: '1 1 280px', display: 'grid', gap: 12 }}>
          <h2>Nuevo cliente</h2>
          <div className="campo">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} required />
            {errores.nombre && <small className="error">{errores.nombre[0]}</small>}
          </div>
          <div className="campo">
            <label htmlFor="telefono">Teléfono (10 dígitos)</label>
            <input id="telefono" value={nuevo.telefono} onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })} required />
            {errores.telefono && <small className="error">{errores.telefono[0]}</small>}
          </div>
          <div className="campo">
            <label htmlFor="notas">Notas</label>
            <textarea id="notas" rows={3} value={nuevo.notas} onChange={(e) => setNuevo({ ...nuevo, notas: e.target.value })} />
          </div>
          {errores.general && <p className="error">{errores.general[0]}</p>}
          {aviso && <p>{aviso}</p>}
          <button className="boton boton--primario">Guardar cliente</button>
        </form>
      </div>
    </>
  )
}