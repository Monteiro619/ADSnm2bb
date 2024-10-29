import { useNavigate } from "react-router-dom";
import Cabecalho from "../componentes/Cabecalho";
import Conteudo from "../componentes/Conteudo";
import Listagem from "./Listagem";
import { useEffect, useState } from "react";
import { buscarTodos, remover } from "../services/ContatoService";


function Listar() {
    const navigate = useNavigate();
    const [contatos, setContatos] = useState([]);
    const [erro, setErro] = useState("");

    const carregar = async( ) => {
        const resultado = await buscarTodos();
        if (resultado.sucesso) {
            setContatos(resultado.dados);
            setErro("");
        } else {
            setContatos([]);
            setErro(resultado.mensagem);
        }
    };
    const onEditar = (id) => {
        navigate(`/editar/${id}`);
    }

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
                <Listagem  itens={contatos} onEditar={onEditar} onRemover={onRemover} />
            </Conteudo>
        </>
    );
}

export default Listar;