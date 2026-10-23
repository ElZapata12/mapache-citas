import { useParams } from 'react-router-dom'

export default function DetalleCita() {
  const { id } = useParams() // el número que viene en la URL: /citas/12
  return <h1>Cita #{id}</h1>
}
