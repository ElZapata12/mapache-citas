
const ChipEstado = ({ estado = 'pendiente' }) => {
const estadoNormalizado = estado.toLowerCase();
const estilosPorEstado = {
    pendiente: {
    backgroundColor: '#fff3bf',
    color: '#d9480f',
    border: '1px solid #fcc419',
    },
    confirmada: {
    backgroundColor: '#d3f9d8',
    color: '#2b8a3e',
    border: '1px solid #8ce99a',
    },
    cancelada: {
    backgroundColor: '#ffe3e3',
    color: '#e03131',
    border: '1px solid #ffa8a8',
    },
};

const estiloActual = estilosPorEstado[estadoNormalizado] || estilosPorEstado.pendiente;

return (
    <span
    style={{
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'inline-block',
        textTransform: 'capitalize',
        ...estiloActual,
    }}
    >
    {estado}
    </span>
    );
};

export default ChipEstado;