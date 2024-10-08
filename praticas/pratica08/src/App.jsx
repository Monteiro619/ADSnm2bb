import React from 'react';
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import Erro404 from './pages/Erro404';
import Home from './pages/Home';
import Login from './pages/Login';
import Perfil from './pages/Perfil';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/perfil/:id"element={<Perfil />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Erro404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
