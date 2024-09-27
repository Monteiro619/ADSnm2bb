import {useParams} from "react-router-dom";
import Botao from "../components/Botao";
import InputEmail from "../components/InputEmail";
import InputSenha from "../components/InputSenha";
import Secao from "../components/Secao";

const { id } = useParams();

function Perfil() {
    return (
      <>
       {id == 1 ? 
       <Secao texto="Perfil do Usuário">
         <InputEmail valor="aluno@email.com" mudaValor={()=>{}} />
         <InputSenha valor="" mudaValor={()=>{}} />
         <Botao texto="Salvar" />
       </Secao>
       : <p>Usuário não encontrado</p> }
      </>
    );
  }
  
export default Perfil;