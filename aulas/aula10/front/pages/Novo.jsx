import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../componentes/Cabecalho";
import Conteudo from "../componentes/Conteudo";
import Formulario from "./Formulario";
import { adicionar } from "../services/ContatoService";

function Novo() {
    const [erro, setErro] = useState ("");
    const navigate = useNavigate ();

    const onSalvar = async (data) => {
        const resultado = await adicionar(data);
        if (resultado.sucesso) {
            setErro("");
            navigate("/");
        } else {
            setErro(`Erro! ${resultado.mensagem} `);
        }
    }

    return(
        <>
            <Cabecalho />
            <Conteudo>
                {erro && <p>{erro}</p>}
                <h2>Novo Contato</h2>
                <Formulario dados={{}} trataEnviar={onSalvar} />
            </Conteudo>
        </>
    );
}

export default Novo;