export function hoyISO() {
    const hoy = new Date()
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const dia = String(hoy.getDate()).padStart(2, '0')
    return `${hoy.getFullYear()}-${mes}-${dia}`
}

// "2026-10-28T14:00:00-06:00" -> "14:00"
export function hora(fechaISO) {
    return new Date(fechaISO).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function dinero(cantidad) {
    return Number(cantidad).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}