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
        backgroundColor: "#000",
      }}
    >
      {/* Fondo animado de polígonos azules */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "#000000" },
          fpsLimit: 60,
          particles: {
            number: {
              value: 80,
              density: { enable: true, area: 800 },
            },
            color: { value: "#00aaff" },
            shape: {
              type: "polygon",
              polygon: { sides: 6 },
            },
            opacity: {
              value: 0.6,
              random: true,
              anim: {
                enable: true,
                speed: 0.5,
                opacity_min: 0.3,
                sync: false,
              },
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 0.5,
                sync: false,
              },
            },
            links: {
              enable: true,
              distance: 150,
              color: "#00aaff",
              opacity: 0.5,
              width: 1.2,
              triangles: {
                enable: true,
                color: "#0099ff",
                opacity: 0.05,
              },
            },
            move: {
              enable: true,
              speed: 1.2,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "bounce" },
              attract: { enable: true, rotateX: 600, rotateY: 1200 },
            },
            shadow: {
              enable: true,
              color: "#00aaff",
              blur: 10,
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
          filter: "drop-shadow(0 0 8px #00aaff)",
        }}
      />

      {/* Contenido del login */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          marginTop: "100px",
          color: "white",
        }}
      >
        <h1>
          <a href="/" style={{ color: "#00aaff", textDecoration: "none" }}>
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
            style={{
              padding: "10px",
              margin: "8px",
              borderRadius: "5px",
              border: "1px solid #00aaff",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              width: "220px",
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
              padding: "10px",
              margin: "8px",
              borderRadius: "5px",
              border: "1px solid #00aaff",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              width: "220px",
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
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

        <p style={{ color: "#00aaff" }}>{message}</p>
      </div>
    </div>
  );
}

export default Login;
