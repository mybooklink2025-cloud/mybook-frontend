import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1 style={{ color: "blue" }}>MyBook</h1>
              <nav style={{ marginBottom: "20px" }}>
                <a href="/">Iniciar sesión</a> | <a href="/register">Registrarse</a>
              </nav>
              <Login onLogin={handleLogin} />
            </div>
          } 
        />
        <Route 
          path="/register" 
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1 style={{ color: "blue" }}>MyBook</h1>
              <nav style={{ marginBottom: "20px" }}>
                <a href="/">Iniciar sesión</a> | <a href="/register">Registrarse</a>
              </nav>
              <Register onRegister={handleLogin} />
            </div>
          } 
        />
        <Route 
          path="/profile" 
          element={token ? <Profile token={token} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
