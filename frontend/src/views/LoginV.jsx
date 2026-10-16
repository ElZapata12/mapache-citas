import './LoginV.css';
export default function LoginV(){
    return (
        <div className="Login-fondo">
        <div className="Login-carta">
        <div className="Panel-lateral">
            <h1>EL MAPACHE BIGOTON</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus eum amet ratione deleniti, voluptatum id, laudantium deserunt est odit velit at architecto eveniet nesciunt dolores rerum similique optio, ex odio!</p>
        </div>

        <div className="Panel-formato">
            <h2>Inicia Sesión</h2>
            <p>Lorem ipsum dolor sit amet consectetur </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
                <label>Correo</label>
                <input type="email" placeholder="juanlorens786@gmail.com" />
            </div>

            <div  className="input-group">
                <label>Contraseña</label>
                <input type="password" placeholder="°°°°°°°°" />
            </div>

            <button type="submit" className="btnEntrar">
                Ingresar
            </button>
        </form>
    </div>
</div>
    );
}