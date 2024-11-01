import { BrowserRouter, Routes, Route} from "react-hook-form"
import Novo from "./pages/Novo";
import Error404 from "./pages/Error404";
import Editar from "./pages/Editar";
import Listar from "./pages/Listar";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Listar />} />
        <Route path="/novo" element={<Novo />} />
        <Route path="/editar/:id" element={<Editar />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>

    </>
  );
}

export default App;
