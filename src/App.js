import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Import obligatorio
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Contactanos from "./Contactanos";
import Muro from "./Muro";
import Chat from "./Chat"; // ✅ Importamos el chat

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  return (
    // ✅ Todo el sistema envuelto dentro del proveedor de Google
    <GoogleOAuthProvider clientId="20434049090-o87fehjhstkngj10389ov7bad02sb1in.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* ✅ Página de inicio: login embebido */}
          <Route 
            path="/" 
            element={
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1 style={{ color: "blue" }}>MyBook</h1>
                <nav style={{ marginBottom: "20px" }}>
                  <a href="/">Iniciar sesión</a> |{" "}
                  <a href="/register">Registrarse</a> |{" "}
                  <a href="/contactanos">Contáctanos</a>
                </nav>
                <Login setToken={handleLogin} />
              </div>
            } 
          />

          {/* ✅ Página de registro */}
          <Route 
            path="/register" 
            element={
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1 style={{ color: "blue" }}>MyBook</h1>
                <nav style={{ marginBottom: "20px" }}>
                  <a href="/">Iniciar sesión</a> |{" "}
                  <a href="/register">Registrarse</a> |{" "}
                  <a href="/contactanos">Contáctanos</a>
                </nav>
                <Register onRegister={handleLogin} />
              </div>
            } 
          />

          {/* ✅ Perfil: protegido con token */}
          <Route 
            path="/profile" 
            element={token ? <Profile token={token} /> : <Navigate to="/" />} 
          />

          {/* ✅ Muro general: protegido */}
          <Route 
            path="/muro"
            element={token ? <Muro /> : <Navigate to="/" />}
          />

          {/* ✅ Chat entre usuarios: protegido */}
          <Route
            path="/chat"
            element={token ? <Chat /> : <Navigate to="/" />}
          />

          {/* ✅ Contacto */}
          <Route path="/contactanos" element={<Contactanos />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
