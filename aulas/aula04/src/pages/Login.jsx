import Botao from "../components/Botao";
import InputEmail from "../components/InputEmail";
import InputSenha from "../components/InputSenha";
import Link from "../components/Link";
import Logo from "../components/Logo";
import Rodape from "../components/Rodape";
import Titulo from "../components/Titulo";
import Conteudo from "../components/Conteudo";


function Login () {
    return (
        <>
            <Conteudo>
                <Logo imagem="https://www.svgrepo.com/show/411955/learn.svg" texto="Logo da Aplicação"/>
                <Titulo texto="Aluno Online"/>
                <InputEmail />
                <InputSenha />
                <Botao texto="Entrar" />
                <Link texto="Esqueceu Senha" />
            </Conteudo>
            <Rodape />
        </>
    );
}

export default Login;