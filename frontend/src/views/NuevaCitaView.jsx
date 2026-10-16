const NuevaCitaView = () => {
return (
    <div className="view-container">
    <h2>Agendar Nueva Cita</h2>
    <form>
        <input type="text" placeholder="Nombre del cliente" />
        <input type="datetime-local" />
        <button type="submit">Guardar Cita</button>
    </form>
    </div>
    );
};

export default NuevaCitaView;