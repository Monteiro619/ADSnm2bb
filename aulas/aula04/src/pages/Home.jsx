import Cabecalho from "../components/Cabecalho";
import Conteudo from "../components/Conteudo";
import Menu from "../components/Menu";

function Home () {
    return (
        <>
            <Cabecalho />
            <Conteudo>  
                <Menu />
            </Conteudo>
        </>
    );
}

export default Home;

