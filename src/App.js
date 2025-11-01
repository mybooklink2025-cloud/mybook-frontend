import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Contactanos from "./Contactanos";
import Muro from "./Muro";
import Chat from "./Chat";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  return (
    <GoogleOAuthProvider clientId="20434049090-o87fehjhstkngj10389ov7bad02sb1in.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ textAlign: "center", position: "relative", height: "100vh", overflow: "hidden" }}>
                <Login setToken={handleLogin} />
              </div>
            }
          />

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

          <Route
            path="/profile"
            element={token ? <Profile token={token} /> : <Navigate to="/" />}
          />

          <Route
            path="/muro"
            element={token ? <Muro /> : <Navigate to="/" />}
          />

          <Route
            path="/chat"
            element={token ? <Chat /> : <Navigate to="/" />}
          />

          <Route path="/contactanos" element={<Contactanos />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
