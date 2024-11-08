import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Erro404 from "./pages/Erro404";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Registrar from "./pages/Registrar";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { usuario } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {usuario.logado ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/perfil" element={<Perfil />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Registrar />} />
          </>
        )}
        <Route path="*" element={<Erro404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
