import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1 style={{ color: "blue" }}>MyBook</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/">Iniciar sesión</Link> |{" "}
          <Link to="/register">Registrarse</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
