import React, { useState } from "react";
import { registrarUsuario } from "./api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage("❌ La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setMessage("❌ La contraseña debe contener al menos una mayúscula");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setMessage("❌ La contraseña debe contener al menos un número");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setMessage("❌ La contraseña debe contener al menos un carácter especial");
      return;
    }

    try {
      const data = await registrarUsuario({ email, password });
      if (data.token || data.message === "Usuario registrado correctamente ✅") {
        setMessage("✅ Registro exitoso");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
       {/* 🌌 Fondo degradado sin polígonos */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at 30% 20%, #0d1b3a 0%, #081326 50%, #01060f 100%)",
        zIndex: -1,
      }}
    ></div>

      <h1>
        <a href="/" style={{ color: "blue", textDecoration: "none" }}>MyBook</a>
      </h1>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required /><br />

        <p style={{ color: "white", fontSize: "13px" }}>
          La contraseña debe cumplir con estos requisitos:
          <br />
          • Mínimo 8 caracteres
          <br />
          • Al menos una letra mayúscula
          <br />
          • Al menos un número
          <br />
          • Al menos un carácter especial
        </p>

        <button type="submit">Registrarse</button>
      </form>
      <p style={{ color: "blue" }}>{message}</p>
    </div>
  );
}

export default Register;