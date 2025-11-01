import React, { useState, useCallback } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { iniciarSesion } from "./api";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Login tradicional
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

  // Google login handlers (mismos que tenías)
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("✅ Usuario Google:", decoded);
      localStorage.setItem("token", credentialResponse.credential);
      if (typeof setToken === "function") setToken(credentialResponse.credential);
      window.location.replace("/muro");
    } catch (err) {
      console.error("Error decodificando token:", err);
    }
  };

  const handleGoogleError = () => {
    setMessage("❌ Error al iniciar sesión con Google");
  };

  // Inicializador de particles (loadFull)
  const particlesInit = useCallback(async (engine) => {
    // útil para debugging si no carga
    console.log("tsparticles init — cargando engine...", engine);
    await loadFull(engine);
    console.log("tsparticles loadFull completado");
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        // aclaramos un poco el fondo para que los polígonos resalten
        background: "linear-gradient(180deg, #071026 0%, #000814 100%)",
      }}
    >
      {/* Partículas: polígono + glow */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            number: { value: 70, density: { enable: true, area: 900 } },
            color: { value: "#00aaff" }, // azul del logo
            shape: {
              type: "polygon",
              polygon: { sides: 6 }, // hexágonos
            },
            size: { value: 3, random: { enable: true, minimumValue: 1 }, animation: { enable: true, speed: 3, minimumValue: 0.3 } },
            opacity: { value: 0.7, random: { enable: true, minimumValue: 0.3 }, animation: { enable: true, speed: 0.6, minimumValue: 0.2 } },
            links: {
              enable: true,
              distance: 160,
              color: "#00aaff",
              opacity: 0.45,
              width: 1.2,
            },
            move: {
              enable: true,
              speed: 1.1,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "bounce" },
            },
            // sombra/glow en partículas (tsparticles soporta shadow)
            shadow: {
              enable: true,
              color: "#00aaff",
              blur: 12,
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              repulse: { distance: 120, duration: 0.4 },
              push: { quantity: 3 },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          // drop-shadow global para realzar el efecto neón
          filter: "drop-shadow(0 0 10px rgba(0,170,255,0.35))",
          opacity: 1,
        }}
      />

      {/* Cuadro del login — igual que antes, centrado y sin cambiar lógica */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(2,6,20,0.72)",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,170,255,0.14)",
          padding: "36px",
          width: "320px",
          margin: "10vh auto",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ color: "#00aaff", marginBottom: "10px" }}>MyBook</h1>
        <h2 style={{ marginBottom: "18px" }}>Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "92%",
              padding: "10px",
              margin: "8px 0",
              borderRadius: "6px",
              border: "1px solid rgba(0,170,255,0.25)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
            }}
          />
          <br />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "92%",
              padding: "10px",
              margin: "8px 0",
              borderRadius: "6px",
              border: "1px solid rgba(0,170,255,0.25)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "12px",
              backgroundColor: "#00aaff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0099ff")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#00aaff")}
          >
            Ingresar
          </button>
        </form>

        <div style={{ marginTop: "18px" }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        <p style={{ color: "#00aaff", marginTop: "12px" }}>{message}</p>
      </div>
    </div>
  );
}

export default Login;
