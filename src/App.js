import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
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
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1 style={{ color: "blue" }}>MyBook</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/">Iniciar sesión</Link> |{" "}
          <Link to="/register">Registrarse</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={token ? <Profile token={token} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
