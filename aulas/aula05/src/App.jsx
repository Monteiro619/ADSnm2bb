import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";

function App() {
  const [rota, setRota] = useState("/login");

  return (
    <>
      {rota === '/login' && <Login navegaPara={setRota} />}
      {rota === '/home' && <Home navegaPara={setRota} />}
      {rota === '/perfil' && <Perfil navegaPara={setRota} />}
    </>
  );
}

export default App;