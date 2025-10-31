import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { iniciarSesion } from "./api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Inicio de sesión tradicional
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await iniciarSesion({ email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (typeof setToken === "function") setToken(data.token);
        setMessage("✅ Inicio de sesión exitoso");
        window.location.replace("/muro");
      } else {
        setMessage(`❌ ${data.message || "Error al iniciar sesión"}`);
      }
    } catch (error) {
      setMessage("❌ Error al conectar con el servidor");
      console.error("Login error:", error);
    }
  };

  // 🔹 Inicio de sesión con Google
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      console.log("👤 Usuario Google:", decoded);

      localStorage.setItem("token", credentialResponse.credential);
      localStorage.setItem("email", decoded.email);
      setMessage(`✅ Bienvenido ${decoded.name || decoded.email}`);
      window.location.replace("/muro");
    } catch (err) {
      console.error("Error decodificando token de Google:", err);
      setMessage("❌ Error al procesar inicio con Google");
    }
  };

  const handleGoogleError = () => {
    setMessage("❌ Error al iniciar sesión con Google");
  };

  return (
    <GoogleOAuthProvider clientId="20434049090-o87fehjhstkngj10389ov7bad02sb1in.apps.googleusercontent.com">
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>
          <a href="/" style={{ color: "blue", textDecoration: "none" }}>
            MyBook
          </a>
        </h1>
        <h2>Iniciar sesión</h2>

        {/* 🔹 Formulario tradicional */}
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

        {/* 🔹 Separador */}
        <div style={{ margin: "20px 0", fontWeight: "bold" }}>o</div>

        {/* 🔹 Botón de Google */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          shape="pill"
          size="large"
          width="250"
        />

        <p style={{ color: "blue", marginTop: "15px" }}>{message}</p>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
