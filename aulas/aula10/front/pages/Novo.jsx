import Cabecalho from "../componentes/Cabecalho";
import Conteudo from "../componentes/Conteudo";
import Formulario from "./Formulario";

function Novo() {
    return(
        <>
            <Cabecalho />
            <Conteudo>
                <h2>Novo Contato</h2>
                <Formulario trataEnviar={() => {}} />
            </Conteudo>
        </>
    );
}

export default Novo;