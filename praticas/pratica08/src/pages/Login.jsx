import Conteudo from "../components/Conteudo";
import Rodape from "../components/Rodape";
import FormLogin from "./FormLogin";

function Login () {
    return (
        <>
            <Conteudo>
                <h1>Aluno Online</h1>
                <FormLogin />
            </Conteudo>
            <Rodape />
        </>
    );
}

export default Login;