import { useEffect, useState } from 'react'
import { listarSucursales } from '../api/endpoints.js'

export default function SelectorSucursal({ valor, onCambio, conTodas = true }) {
    const [sucursales, setSucursales] = useState([])

    useEffect(() => {
    listarSucursales().then(setSucursales).catch(() => setSucursales([]))
    }, [])

return (
    <div className="campo">
    <label htmlFor="sucursal">Sucursal</label>
    <select id="sucursal" value={valor} onChange={(e) => onCambio(e.target.value)}>
        <option value="">{conTodas ? 'Todas' : 'Elige…'}</option>
        {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
    </select>
    </div>
    )
}
