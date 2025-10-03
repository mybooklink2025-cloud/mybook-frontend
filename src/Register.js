import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "./api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registrarUsuario(email, password);
      setMessage("✅ Registro exitoso, ahora inicia sesión");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setMessage("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ color: "blue" }}>MyBook</h1>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required /><br />
        <button type="submit">Registrarse</button>
      </form>
      <p style={{ color: "blue" }}>{message}</p>
    </div>
  );
}

export default Register;
