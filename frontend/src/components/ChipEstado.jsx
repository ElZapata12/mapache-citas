const NOMBRES = {
  programada: 'Programada',
  atendida: 'Atendida',
  cancelada: 'Cancelada',
  no_asistio: 'No asistió',
}

// El estado siempre se muestra con color Y con su nombre (no solo con color).
export default function ChipEstado({ estado }) {
  return <span className={`chip chip--${estado}`}>{NOMBRES[estado] ?? estado}</span>
}
