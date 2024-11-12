import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Formulario from "./Formulario";

function Login () {
    const navigate = useNavigate();

    const { login, msg } = useContext(AuthContext);

    const onEntrar = (data) => {
        login(data);
            if (!msg) navigate ("/home")
    }

    return (
        <>
            <h1>Login</h1>
            {msg && <p> {msg} </p>}
            <Formulario onClick={onEntrar} texto="Entrar" />
            <Link to="/registrar">Registrar</Link>
        </>
    );
}

export default Login;