import React, { useState, useCallback } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode"; // import correcto
import { iniciarSesion } from "./api";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // mantengo exactamente tu lógica de login
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
      if (typeof setToken === "function") setToken(credentialResponse.credential);
      window.location.replace("/muro");
    } catch (err) {
      console.error("Error decodificando token:", err);
    }
  };

  const handleGoogleError = () => {
    setMessage("❌ Error al iniciar sesión con Google");
  };

  // inicializador de tsparticles (useCallback)
  const particlesInit = useCallback(async (engine) => {
    console.log("tsparticles init...");
    await loadFull(engine);
    console.log("tsparticles loaded");
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        // Fondo ligeramente aclarado para contraste (mantiene el look oscuro)
        background: "radial-gradient(circle at 30% 20%, #07142b 0%, #000814 60%, #000000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Roboto, sans-serif",
      }}
    >
      {/* Partículas (canvas absoluto en zIndex 0) */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          detectRetina: true,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              repulse: { distance: 140, duration: 0.4 },
              push: { quantity: 3 },
            },
          },
          particles: {
            number: { value: 72, density: { enable: true, area: 900 } },
            color: { value: "#0099FF" },         // azul fuerte
            shape: { type: "polygon", polygon: { sides: 6 } }, // hexágonos
            opacity: {
              value: 0.8,
              random: { enable: true, minimumValue: 0.35 },
              anim: { enable: true, speed: 0.7, minimumValue: 0.25 },
            },
            size: {
              value: { min: 1.5, max: 4 },
              random: true,
              animation: { enable: true, speed: 2, minimumValue: 0.5 },
            },
            links: {
              enable: true,
              distance: 160,
              color: "#00b3ff",
              opacity: 0.55,
              width: 1.3,
            },
            move: {
              enable: true,
              speed: 1.06,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "bounce" },
            },
            // shadow/neon glow por partícula
            shadow: {
              enable: true,
              color: "#00b3ff",
              blur: 14,
            },
            // triangles (ligero) para emular red de polígonos
            // nota: triangles a veces requiere soporte; dejamos básico arriba
          },
        }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          // refuerzo visual neón global sin romper layout
          filter: "drop-shadow(0 0 12px rgba(0,179,255,0.18))",
          opacity: 0.96,
        }}
      />

      {/* Contenedor del cuadro (zIndex 1) EXACTO como en tu imagen:
          - Título MyBook arriba
          - "Iniciar sesión"
          - Inputs (correo, contraseña)
          - Botón Ingresar
          - GoogleAuth (debajo), todo dentro del mismo cuadro */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: 360,
          maxWidth: "92%",
          background: "linear-gradient(180deg, rgba(2,10,28,0.88), rgba(2,6,20,0.76))",
          borderRadius: 14,
          padding: "34px 28px",
          boxShadow: "0 12px 40px rgba(0,170,255,0.14)",
          border: "1px solid rgba(0,170,255,0.06)",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ margin: 0, marginBottom: 6, color: "#00b3ff", fontSize: 28 }}>MyBook</h1>

        <h2 style={{ marginTop: 6, marginBottom: 18, fontSize: 18, fontWeight: 500 }}>Iniciar sesión</h2>

        <form onSubmit={handleLogin} style={{ display: "block" }}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 10px",
              margin: "8px 0",
              borderRadius: 8,
              border: "1px solid rgba(0,179,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
              fontSize: 14,
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 10px",
              margin: "10px 0 6px 0",
              borderRadius: 8,
              border: "1px solid rgba(0,179,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
              fontSize: 14,
              outline: "none",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 14px",
              marginTop: 10,
              borderRadius: 8,
              background: "linear-gradient(90deg, #00b3ff, #0099ff)",
              color: "#001018",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(0,179,255,0.18)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.95")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Ingresar
          </button>
        </form>

        {/* Google Auth exactamente abajo dentro del mismo cuadro */}
        <div style={{ marginTop: 18 }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        <p style={{ color: "#00b3ff", marginTop: 14 }}>{message}</p>
      </div>
    </div>
  );
}

export default Login;
