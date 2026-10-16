const LoginView = () => {
    return (
    <div className="view-container">
    <h2>Iniciar Sesión</h2>
    <form>
        <input type="text" placeholder="Usuario / Correo" />
        <input type="password" placeholder="Contraseña" />
        <button type="submit">Ingresar</button>
    </form>
    </div>
    );
};

export default LoginView;