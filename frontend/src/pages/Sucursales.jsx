import { useEffect, useState } from 'react'
import { actualizarSucursal, crearSucursal, listarSucursales } from '../api/endpoints.js'

const VACIA = { nombre: '', direccion: '', telefono: '' }

export default function Sucursales() {
const [sucursales, setSucursales] = useState([])
const [form, setForm] = useState(VACIA)
const [editandoId, setEditandoId] = useState(null)
const [errores, setErrores] = useState({})
const [aviso, setAviso] = useState('')

useEffect(() => {
    listarSucursales(true).then(setSucursales).catch((e) => setErrores({ general: [e.message] }))
}, [])

function reemplazar(actualizada) {
    setSucursales((lista) => lista.map((s) => (s.id === actualizada.id ? actualizada : s)))
}

async function guardar(evento) {
    evento.preventDefault()
    setErrores({})
    setAviso('')
    try {
    if (editandoId) {
        const actualizada = await actualizarSucursal(editandoId, form)
        reemplazar(actualizada)
        setAviso(`Se actualizó ${actualizada.nombre}.`)
    } else {
        const creada = await crearSucursal(form)
        setSucursales((lista) => [...lista, creada])
        setAviso(`Se creó ${creada.nombre}.`)
    }
    setForm(VACIA)
    setEditandoId(null)
    } catch (e) {
    setErrores(e.campos ?? { general: [e.message] })
    }
}

function editar(sucursal) {
    setEditandoId(sucursal.id)
    setForm({ nombre: sucursal.nombre, direccion: sucursal.direccion, telefono: sucursal.telefono })
    setErrores({})
    setAviso('')
}

function cancelarEdicion() {
    setEditandoId(null)
    setForm(VACIA)
    setErrores({})
}

async function alternarActiva(sucursal) {
    setErrores({})
    setAviso('')
    try {
    reemplazar(await actualizarSucursal(sucursal.id, { activa: !sucursal.activa }))
    } catch (e) {
    setErrores({ general: [e.message] })
    }
}

const campo = (nombre, etiqueta) => (
    <div className="campo">
    <label htmlFor={nombre}>{etiqueta}</label>
    <input id={nombre} value={form[nombre]} onChange={(e) => setForm({ ...form, [nombre]: e.target.value })} />
    {errores[nombre] && <span className="error">{errores[nombre].join(' ')}</span>}
    </div>
)

return (
    <>
    <h1>Sucursales</h1>
    <div style={{ alignItems: 'start', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <section className="tarjeta" style={{ flex: '2 1 420px' }}>
        <table>
            <thead>
            <tr><th>Nombre</th><th>Dirección</th><th>Teléfono</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
            {sucursales.map((s) => (
                <tr key={s.id}>
                <td>{s.nombre}</td>
                <td>{s.direccion}</td>
                <td>{s.telefono}</td>
                <td>{s.activa ? 'Activa' : 'Inactiva'}</td>
                <td>
                    <button className="boton" onClick={() => editar(s)}>Editar</button>{' '}
                    <button className="boton" onClick={() => alternarActiva(s)}>
                    {s.activa ? 'Desactivar' : 'Activar'}
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        {sucursales.length === 0 && <p className="vacio">Todavía no hay sucursales.</p>}
        {errores.general && <p className="error" role="alert">{errores.general.join(' ')}</p>}
        </section>

        <form className="tarjeta" style={{ flex: '1 1 280px', display: 'grid', gap: 12 }} onSubmit={guardar}>
        <h2>{editandoId ? 'Editar sucursal' : 'Nueva sucursal'}</h2>
        {campo('nombre', 'Nombre')}
        {campo('direccion', 'Dirección')}
        {campo('telefono', 'Teléfono (10 dígitos)')}
        {aviso && <p role="status">{aviso}</p>}
        <div className="fila">
            <button className="boton boton--primario" type="submit">{editandoId ? 'Guardar cambios' : 'Agregar'}</button>
            {editandoId && <button className="boton" type="button" onClick={cancelarEdicion}>Cancelar</button>}
        </div>
        </form>
    </div>
    </>
    )
}
