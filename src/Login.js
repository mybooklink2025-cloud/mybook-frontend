import React, { useState } from "react";
import { iniciarSesion } from "./api";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await iniciarSesion({ email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (typeof setToken === "function") setToken(data.token);
        setMessage("✅ Inicio de sesión exitoso");
        window.location.replace("/muro"); // redirige al muro
      } else {
        setMessage(`❌ ${data.message || "Error al iniciar sesión"}`);
      }
    } catch (error) {
      setMessage("❌ Error al conectar con el servidor");
      console.error("Login error:", error);
    }
  };

  // 🔹 Manejo del inicio de sesión con Google
  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Usuario con Google:", decoded);

    // Puedes guardar los datos del usuario en localStorage
    localStorage.setItem("userGoogle", JSON.stringify(decoded));

    // Redirigir al muro (o crear usuario en tu backend si lo deseas)
    window.location.replace("/muro");
  };

  const handleGoogleError = () => {
    console.error("❌ Error al iniciar sesión con Google");
    setMessage("❌ Error al iniciar sesión con Google");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>
        <a href="/" style={{ color: "blue", textDecoration: "none" }}>
          MyBook
        </a>
      </h1>
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Ingresar</button>
      </form>

      <p style={{ color: "blue" }}>{message}</p>

      {/* 🔹 Botón de inicio de sesión con Google */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>
    </div>
  );
}

export default Login;
