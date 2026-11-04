import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listarCitas } from '../api/endpoints.js'
import ChipEstado from '../components/ChipEstado.jsx'
import SelectorSucursal from '../components/SelectorSucursal.jsx'
import { useSesion } from '../context/sesion.js'
import { hora, hoyISO } from '../utils/fechas.js'

export default function Agenda() {
  const { usuario } = useSesion()
  const [params, setParams] = useSearchParams()
  const fecha = params.get('fecha') || hoyISO()
  const sucursal = params.get('sucursal') || ''
  const esAdmin = usuario.rol === 'admin'

  function cambiarParam(nombre, valor) {
    const nuevos = new URLSearchParams(params)
    if (valor) nuevos.set(nombre, valor)
    else nuevos.delete(nombre)
    setParams(nuevos)
  }

  const clave = `${fecha}|${sucursal}`
  const [resultado, setResultado] = useState({ clave: null, citas: [], error: '' })

  useEffect(() => {
    let vigente = true
    listarCitas(fecha, sucursal)
      .then((citas) => vigente && setResultado({ clave, citas, error: '' }))
      .catch((e) => vigente && setResultado({ clave, citas: [], error: e.message }))
    return () => {
      vigente = false
    }
  }, [fecha, sucursal, clave])

  const cargando = resultado.clave !== clave
  const { citas, error } = resultado

  const porBarbero = {}
  for (const cita of citas) {
    porBarbero[cita.barbero] ??= { nombre: cita.barbero_nombre, sucursal: cita.sucursal_nombre, citas: [] }
    porBarbero[cita.barbero].citas.push(cita)
  }

  return (
    <>
      <div className="fila" style={{ justifyContent: 'space-between' }}>
        <h1>Agenda del día</h1>
        <div className="fila">
          <input
            type="date"
            aria-label="Fecha"
            value={fecha}
            onChange={(e) => e.target.value && cambiarParam('fecha', e.target.value)}
            className="boton"
          />
          {esAdmin && <SelectorSucursal valor={sucursal} onCambio={(v) => cambiarParam('sucursal', v)} />}
          {usuario.rol !== 'barbero' && (
            <Link className="boton boton--primario" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }} to="/citas/nueva">
              Nueva cita
            </Link>
          )}
        </div>
      </div>

      {cargando && <p className="vacio">Cargando citas…</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && citas.length === 0 && <p className="vacio">No hay citas este día.</p>}

      <div className="agenda">
        {Object.entries(porBarbero).map(([id, grupo]) => (
          <section key={id} className="tarjeta">
            <h2>{grupo.nombre}</h2>
            {esAdmin && !sucursal && <span className="vacio">{grupo.sucursal} · </span>}
            <span className="vacio">{grupo.citas.length} citas</span>
            {grupo.citas.map((cita) => (
              <Link key={cita.id} to={`/citas/${cita.id}`} className={`cita cita--${cita.estado}`}>
                <strong>{hora(cita.inicio)}–{hora(cita.fin)}</strong> · {cita.cliente_nombre}
                <br />
                <small>{cita.servicios.map((s) => s.descripcion).join(' + ')}</small>
                <br />
                <ChipEstado estado={cita.estado} />
              </Link>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}