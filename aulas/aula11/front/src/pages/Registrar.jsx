import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";



function Registrar () {
    const { registrar } = useContext (AuthContext);
    const onSalvar = () => {
        registrar({email:"jose@iesb.br" , senha: "abcd1234"});
        Navigate("/home");
    }
    
    return (
        <>
            <h1>Registrar</h1>
            <button onClick={onSalvar}>Salvar</button>
            
        </>
    );
}

export default Registrar;