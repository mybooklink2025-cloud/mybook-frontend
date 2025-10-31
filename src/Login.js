import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { iniciarSesion } from "./api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const CLIENT_ID = "20434049090-o87fehjhstkngj10389ov7bad02sb1in.apps.googleusercontent.com";

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

  // 🔹 Manejo del login con Google
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      const emailGoogle = decoded.email;
      localStorage.setItem("token", credentialResponse.credential);
      localStorage.setItem("email", emailGoogle);
      setMessage(`✅ Bienvenido, ${decoded.name || "usuario"}`);
      setTimeout(() => window.location.replace("/muro"), 1000);
    } catch (error) {
      console.error("Error al decodificar token de Google:", error);
      setMessage("❌ Error al iniciar sesión con Google");
    }
  };

  const handleGoogleFailure = () => {
    setMessage("❌ Error al autenticar con Google");
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>
          <a href="/" style={{ color: "blue", textDecoration: "none" }}>
            MyBook
          </a>
        </h1>
        <h2>Iniciar sesión</h2>

        {/* 🔹 Login tradicional */}
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

        <hr style={{ margin: "30px auto", width: "50%" }} />

        {/* 🔹 Botón de Google */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
