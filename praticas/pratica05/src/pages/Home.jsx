import Cabecalho from "../components.jsx/Cabecalho";
import Conteudo from "../components.jsx/Conteudo";
import Menu from "../components.jsx/Menu";
import Secao from "../components.jsx/Secao";
import Painel from "../components.jsx/Painel";
import './Home.css';

function Home() {
    return (
     <>
        <Cabecalho></Cabecalho>
        <Conteudo>
            <Menu />
            <Secao texto="Página Inicial">
                <div estilo="card-grid">
                <Painel texto="Mural de Avisos" itens={["Inscrições para Cursos de Extensão", "Evento Maratona de Programação", "Palestra sobre Inteligência Artificial"]} />
                <Painel texto="Agenda Acadêmica" itens={["Semana de Provas P1", "Entrega de Trabalhos", "Apresentação de TCC"]} />
                <Painel texto="Histórico de Notas" itens={["Lógica de Programação - 5,5", "Banco de Dados - 7,8", "Engenharia de Software - 5,3"]} />
                <Painel texto="Histórico de Faltas" itens={["Lógica de Programação - 4", "Banco de Dados - 0", "Engenharia de Software - 1"]} />
                </div>
            </Secao>
        </Conteudo>
     </>
    );
  }

  export default Home;