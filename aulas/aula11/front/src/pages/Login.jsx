import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


function Login () {
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const onEntrar = () => {
        login({email: "jose@iesb.br", senha: "abcd1234"});
        navigate("/home");
    }

    return (
        <>
            <h1>Login</h1>
            <button onClick={onEntrar}>Entrar</button>
        </>
    );
}

export default Login;