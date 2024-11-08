import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Home () {
    const navigate = useNavigate();

    const { logout } = useContext(AuthContext);

    const onSair = () => {
        logout();
        navigate("/login");
    }


    return (
        <>
            <h1>Home</h1>
            <button onClick={onSair}>Sair</button>
        </>
    );
}

export default Home;