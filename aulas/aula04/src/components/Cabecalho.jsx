import Logo from "./Logo";
import Titulo from "./Titulo";
import InputPesquisar from "./InputPesquisar"

function Cabecalho () {
    return (
        <header>
            <Logo imagem="" texto="" />
            <Titulo texto="Aluno Online" />
            <InputPesquisar />
            <Logo imagem="" texto="Icone de Pesquisar" />
        </header>
    );
}

export default Cabecalho;