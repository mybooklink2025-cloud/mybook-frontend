import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { iniciarSesion } from "./api";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

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
      const decoded = jwtDecode(credentialResponse.credential);
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

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "radial-gradient(circle at center, #0a0a18 0%, #000000 100%)", // 🔵 Fondo más claro
      }}
    >
      {/* Fondo animado */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            number: {
              value: 70,
              density: { enable: true, area: 800 },
            },
            color: { value: "#00aaff" },
            shape: { type: "polygon", polygon: { sides: 6 } },
            opacity: {
              value: 0.5,
              random: true,
              anim: { enable: true, speed: 0.6, opacity_min: 0.3 },
            },
            size: {
              value: 2.5,
              random: true,
              anim: { enable: true, speed: 2, size_min: 0.5 },
            },
            links: {
              enable: true,
              distance: 150,
              color: "#00aaff",
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1.2,
              random: true,
              straight: false,
              outModes: { default: "bounce" },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: { repulse: { distance: 120, duration: 0.4 } },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          opacity: 0.8, // 💡 más visibles
        }}
      />

      {/* Cuadro del login */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(0, 0, 20, 0.8)",
          borderRadius: "15px",
          boxShadow: "0 0 25px rgba(0,170,255,0.4)",
          padding: "40px",
          width: "320px",
          margin: "120px auto",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ color: "#00aaff", marginBottom: "20px" }}>MyBook</h1>
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleLogin} style={{ marginTop: "20px" }}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "90%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
              border: "1px solid #00aaff",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
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
              margin: "10px 0",
              borderRadius: "5px",
              border: "1px solid #00aaff",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              backgroundColor: "#00aaff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0099ff")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#00aaff")}
          >
            Ingresar
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <p style={{ color: "#00aaff", marginTop: "10px" }}>{message}</p>
      </div>
    </div>
  );
}

export default Login;
