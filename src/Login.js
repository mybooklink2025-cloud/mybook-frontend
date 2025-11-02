// src/Login.js
import React, { useState, useEffect, useRef } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { iniciarSesion } from "./api";

/**
 * Login.js final:
 * - Fondo con polígonos (igual que tenías).
 * - Botón propio SOLO con la imagen de la "G" (sin texto).
 * - Lanza useGoogleLogin para autenticación y guarda token.
 * - Compatible con tokenResponse.credential o tokenResponse.access_token.
 *
 * Reemplaza TODO este archivo y ejecuta npm start.
 * Asegurate de tener REACT_APP_GOOGLE_CLIENT_ID en .env o en variables de Vercel.
 */

function LoginContent({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);

  // ----------------------
  // Fondo de polígonos (igual que antes)
  // ----------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;
    let particles = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.size = 1 + Math.random() * 2;
      }
      move() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 170, 255, 0.7)";
        ctx.shadowColor = "#00aaff";
        ctx.shadowBlur = 10;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 90; i++) {
        particles.push(new Particle(Math.random() * w, Math.random() * h));
      }
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 150, 255, 0.15)";
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      const g = ctx.createRadialGradient(
        w * 0.3,
        h * 0.2,
        0,
        w / 2,
        h / 2,
        Math.max(w, h)
      );
      g.addColorStop(0, "#0d1b3a");
      g.addColorStop(0.5, "#081326");
      g.addColorStop(1, "#01060f");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.move();
        p.draw();
      }
      drawLines();
      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  // ----------------------
  // Login normal (email/password)
  // ----------------------
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

  // ----------------------
  // Google login usando useGoogleLogin -> botón propio con img G
  // ----------------------
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // tokenResponse puede contener credential (one-tap) o access_token (oauth)
      let tokenToStore = null;
      try {
        if (tokenResponse && typeof tokenResponse === "object") {
          if (tokenResponse.credential) {
            tokenToStore = tokenResponse.credential;
            // opcional: decodificar si querés user info
            try {
              const decoded = jwtDecode(tokenResponse.credential);
              console.log("Google decoded:", decoded);
            } catch (e) { /* ignore decode errors */ }
          } else if (tokenResponse.access_token) {
            tokenToStore = tokenResponse.access_token;
          } else {
            // a veces la función retorna el token directamente
            tokenToStore = tokenResponse;
          }
        } else {
          tokenToStore = tokenResponse;
        }

        if (tokenToStore) {
          localStorage.setItem("token", tokenToStore);
          if (typeof setToken === "function") setToken(tokenToStore);
          window.location.replace("/muro");
        } else {
          setMessage("❌ No se obtuvo token de Google");
        }
      } catch (err) {
        console.error("Error procesando respuesta Google:", err);
        setMessage("❌ Error al procesar login Google");
      }
    },
    onError: () => {
      setMessage("❌ Error al iniciar sesión con Google");
    },
    flow: "implicit", // funciona para popup
  });

  // ----------------------
  // UI
  // ----------------------
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(0, 0, 0, 0.65)",
          padding: "40px 60px",
          borderRadius: "15px",
          boxShadow: "0 0 25px rgba(0,170,255,0.3)",
          backdropFilter: "blur(6px)",
          textAlign: "center",
          width: "350px",
        }}
      >
        <h1 style={{ color: "#00aaff", marginBottom: "10px" }}>MyBook</h1>
        <h2 style={{ marginBottom: "25px", color: "#aad7ff" }}>
          Iniciar sesión
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
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
              marginBottom: "12px",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#00aaff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Ingresar
          </button>
        </form>

        {/* --- BOTÓN PROPIO SOLO LA "G" --- */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => googleLogin()}
            aria-label="Iniciar sesión con Google"
            style={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 0 15px rgba(0,170,255,0.3)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.12)";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(0,200,255,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(0,170,255,0.3)";
            }}
          >
            {/* Imagen oficial de la G (SVG simple) */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              style={{ width: "22px", height: "22px", display: "block" }}
            />
          </button>
        </div>

        <p style={{ color: "#00aaff", marginTop: "15px" }}>{message}</p>
      </div>
    </div>
  );
}

// Wrap with provider so it works anywhere (use your existing client id)
export default function Login({ setToken }) {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "REPLACE_WITH_YOUR_CLIENT_ID";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginContent setToken={setToken} />
    </GoogleOAuthProvider>
  );
}
