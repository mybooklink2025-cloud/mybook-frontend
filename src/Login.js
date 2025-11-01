import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { iniciarSesion } from "./api";
import ParticlesBackground from "./ParticlesBackground";

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
        window.location.replace("/muro");
      } else {
        setMessage(`❌ ${data.message || "Error al iniciar sesión"}`);
      }
    } catch (error) {
      setMessage("❌ Error al conectar con el servidor");
      console.error("Login error:", error);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      console.log("✅ Usuario Google:", decoded);
      localStorage.setItem("token", credentialResponse.credential);
      if (typeof setToken === "function")
        setToken(credentialResponse.credential);
      window.location.replace("/muro");
    } catch (err) {
      console.error("Error decodificando token:", err);
    }
  };

  const handleGoogleError = () => {
    setMessage("❌ Error al iniciar sesión con Google");
  };

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <ParticlesBackground />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(25, 25, 50, 0.85)",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 0 25px rgba(0, 150, 255, 0.4)",
          textAlign: "center",
          color: "white",
          width: "340px",
        }}
      >
        <h1 style={{ color: "#00aaff", marginBottom: "20px" }}>MyBook</h1>
        <h2 style={{ marginBottom: "20px" }}>Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "90%",
              padding: "10px",
              margin: "8px 0",
              borderRadius: "8px",
              border: "none",
              outline: "none",
              background: "rgba(255,255,255,0.1)",
              color: "white",
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "90%",
              padding: "10px",
              margin: "8px 0",
              borderRadius: "8px",
              border: "none",
              outline: "none",
              background: "rgba(255,255,255,0.1)",
              color: "white",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              border: "none",
              borderRadius: "8px",
              background: "#00aaff",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background 0.3s, transform 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#33bbff";
              e.target.style.transform = "scale(1.03)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#00aaff";
              e.target.style.transform = "scale(1)";
            }}
          >
            Ingresar
          </button>
        </form>

        {/* 🔹 Botón de Google minimalista solo con la G */}
        <div style={{ marginTop: "25px", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              shape="circle"
              theme="outline"
              size="large"
              logo_alignment="center"
              text="signin_with"
            />
            {/* Estilos: ocultar texto, dejar solo la G y añadir hover brillante */}
            <style>
              {`
                div[role="button"] span {
                  display: none !important;
                }
                div[role="button"] {
                  border-radius: 50% !important;
                  width: 48px !important;
                  height: 48px !important;
                  overflow: hidden;
                  display: flex !important;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 0 12px rgba(0, 150, 255, 0.3);
                  transition: all 0.3s ease;
                }
                div[role="button"]:hover {
                  transform: scale(1.15);
                  box-shadow: 0 0 20px rgba(0, 200, 255, 0.6);
                  background: rgba(0, 150, 255, 0.1);
                }
              `}
            </style>
          </div>
        </div>

        <p style={{ color: "#00aaff", marginTop: "20px" }}>{message}</p>
      </div>
    </div>
  );
}

export default Login;
