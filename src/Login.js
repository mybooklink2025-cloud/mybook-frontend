import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "./api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUsuario({ email, password });
      if (data.token) {
        setMessage("✅ Inicio de sesión exitoso");
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ color: "blue" }}>MyBook</h1>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required /><br />
        <button type="submit">Iniciar sesión</button>
      </form>
      <p style={{ color: "blue" }}>{message}</p>
    </div>
  );
}

export default Login;
