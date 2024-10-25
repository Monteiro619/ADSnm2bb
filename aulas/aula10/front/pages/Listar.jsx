import Cabecalho from "../componentes/Cabecalho";
import Conteudo from "../componentes/Conteudo";
import Listagem from "./Listagem";
import { useEffect, useState } from "react";
import { buscarTodos, remover } from "../services/ContatoService";


function Listar() {
    
    const [contatos, setContatos] = useState([]);
    const [erro, setErro] = useState();

    const onRemover = async (id) => {
        const resultado = await remover(id);
        if (resultado.sucesso) {
           await carregar();
        } else {
            setErro(resultado.mensagem);
        }
    };

    useEffect(() => {
            carregar();
    }, []);

    return(
        <>
            <Cabecalho />
            <Conteudo>
                {erro && <p>{erro}</p>}
                <h2>Lista de Contatos</h2>
                <Listagem  itens ={contatos} onRemover={onRemover} />
            </Conteudo>
            
        </>
    );
}

export default Listar;