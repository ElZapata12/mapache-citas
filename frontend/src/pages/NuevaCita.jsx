import { useEffect, useState } from 'react'
import { buscarClientes, listarBarberos, listarServicios, crearCita } from '../api/endpoints.js'
import { dinero } from '../utils/formato.js'

export default function Nuevacita() {
  const [busquedaCliente, setBusquedaCliente] = useState('')
  const [resultadosClientes, setResultadosClientes] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

  const [barberos, setBarberos] = useState([])
  const [servicios, setServicios] = useState([])

  const [barberoId, setBarberoId] = useState('')
  const [fechaHora, setFechaHora] = useState('')
  const [serviciosIds, setServiciosIds] = useState([])

  const [error, setError] = useState('')
  const [exito, setExito] = useState(null)

  // Cargar barberos y servicios al iniciar
  useEffect(() => {
    listarBarberos().then(setBarberos).catch(() => {})
    listarServicios().then(setServicios).catch(() => {})
  }, [])

  // Buscar clientes con retraso
  useEffect(() => {
    if (!busquedaCliente.trim() || clienteSeleccionado) return
    const t = setTimeout(() => {
      buscarClientes(busquedaCliente).then(setResultadosClientes).catch(() => {})
    }, 300)
    return () => clearTimeout(t)
  }, [busquedaCliente, clienteSeleccionado])

  // Valores derivados
  const serviciosSeleccionados = servicios.filter(s => serviciosIds.includes(s.id))
  const minutos = serviciosSeleccionados.reduce((acc, s) => acc + s.duracion_minutos, 0)
  const total = serviciosSeleccionados.reduce((acc, s) => acc + Number(s.precio), 0)

  function toggleServicio(id) {
    setServiciosIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function guardarCita(e) {
    e.preventDefault()
    setError('')
    setExito(null)

    try {
      const nueva = await crearCita({
        cliente: clienteSeleccionado.id,
        barbero: barberoId,
        fecha_hora: fechaHora,
        servicios: serviciosIds
      })
      setExito(nueva)
      setClienteSeleccionado(null)
      setBusquedaCliente('')
      setServiciosIds([])
      setFechaHora('')
      setBarberoId('')
    } catch (err) {
      setError(err.codigo ? `${err.codigo}: ${err.message}` : 'Ocurrió un error al guardar la cita.')
    }
  }

  return (
    <>
      <h1>Nueva cita</h1>
      
      {exito && (
        <div className="tarjeta" style={{ background: '#d1e7dd', color: '#0f5132', marginBottom: 16 }}>
          ¡Cita registrada con éxito!
        </div>
      )}

      <div className="fila" style={{ alignItems: 'start', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        <section className="tarjeta" style={{ flex: '2 1 450px', display: 'grid', gap: 16 }}>
          
          {/* Cliente */}
          <div className="campo">
            <label>Cliente</label>
            {clienteSeleccionado ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '8px 12px', borderRadius: 4 }}>
                <span><strong>{clienteSeleccionado.nombre}</strong> ({clienteSeleccionado.telefono})</span>
                <button type="button" className="boton" onClick={() => setClienteSeleccionado(null)}>Cambiar</button>
              </div>
            ) : (
              <div>
                <input 
                  placeholder="Buscar por nombre o teléfono..." 
                  value={busquedaCliente} 
                  onChange={e => {
                    const val = e.target.value
                    setBusquedaCliente(val)
                    if (!val.trim()) setResultadosClientes([])
                  }} 
                />
                {resultadosClientes.length > 0 && (
                  <ul style={{ background: 'white', border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0, maxHeight: 150, overflowY: 'auto' }}>
                    {resultadosClientes.map(c => (
                      <li key={c.id} onClick={() => { setClienteSeleccionado(c); setResultadosClientes([]); }} style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                        {c.nombre} - {c.telefono}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Servicios */}
          <div className="campo">
            <label>Servicios</label>
            <div style={{ display: 'grid', gap: 8 }}>
              {servicios.map(s => (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={serviciosIds.includes(s.id)} 
                    onChange={() => toggleServicio(s.id)} 
                  />
                  {s.nombre} ({s.duracion_minutos} min - {dinero(s.precio)})
                </label>
              ))}
            </div>
            {serviciosIds.length > 0 && (
              <p style={{ marginTop: 8, fontWeight: 'bold' }}>
                Duración total: {minutos} min · Total: {dinero(total)}
              </p>
            )}
          </div>

          {/* Barbero y Fecha/Hora manual */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div className="campo" style={{ flex: 1 }}>
              <label htmlFor="barbero">Barbero</label>
              <select id="barbero" value={barberoId} onChange={e => setBarberoId(e.target.value)}>
                <option value="">Selecciona...</option>
                {barberos.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
              </select>
            </div>
            <div className="campo" style={{ flex: 1 }}>
              <label htmlFor="fechaHora">Fecha y Hora</label>
              <input type="datetime-local" id="fechaHora" value={fechaHora} onChange={e => setFechaHora(e.target.value)} />
            </div>
          </div>

          {error && <p className="error" style={{ color: 'red' }}>{error}</p>}

          <button 
            type="button"
            className="boton boton--primario" 
            disabled={!clienteSeleccionado || !barberoId || !fechaHora || serviciosIds.length === 0}
            onClick={guardarCita}
          >
            Guardar cita
          </button>
        </section>
      </div>
    </>
  )
}