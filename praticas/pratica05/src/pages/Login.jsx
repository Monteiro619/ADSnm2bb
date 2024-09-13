import Conteudo from "../components.jsx/Conteudo";
import Rodape from "../components.jsx/Rodape";
import Icone from "../components.jsx/Icone";
import Titulo from "../components.jsx/Titulo";
import InputEmail from "../components.jsx/InputEmail";
import InputSenha from "../components.jsx/InputSenha";
import Botao from "../components.jsx/Botao";
import Link from "../components.jsx/Link";
import './Login.css';

function Login() {
    return (
        <>
        <Conteudo estilo="login-container">
            <Icone imagem="" texto="Logo da Aplicação"/>
            <Titulo texto="Aluno Online" />
            <InputEmail />
            <InputSenha />
            <Botao texto="Entrar"/>
            <Link texto="Esqueceu a Senha?" />
        </Conteudo>
        <Rodape texto="Copyright (C) 2024" />
        </>
    );
  }
  
  export default Login;