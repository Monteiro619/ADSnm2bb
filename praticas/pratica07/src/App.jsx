import {BrowserRouter, Route, Routes} from "react-router-dom"
import Perfil from "./pages/Perfil";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Erro404 from "./pages/Erro404";
import Login from "./pages/Login";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route index element={<Login />} />
      <Route element={<Layout />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil/:id" element={<Perfil />} />
      <Route path="*" element={<Erro404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
