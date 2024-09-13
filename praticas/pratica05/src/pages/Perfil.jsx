import Cabecalho from "../components.jsx/Cabecalho";
import Conteudo from "../components.jsx/Conteudo";
import Menu from "../components.jsx/Menu";
import Secao from "../components.jsx/Secao";
import InputEmail from "../components.jsx/InputEmail";
import InputSenha from "../components.jsx/InputSenha";
import Botao from "../components.jsx/Botao";

function Perfil() {
    return (
     <>
        <Cabecalho></Cabecalho>
        <Conteudo>
            <Menu />
            <Secao texto="Perfil do Usuário">
                <InputEmail />
                <InputSenha />
                <Botao texto="Salvar" />
            </Secao>
        </Conteudo>
     </>
    );
  }
  
  export default Perfil;