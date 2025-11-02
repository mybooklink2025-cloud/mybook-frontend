// ✅ Login.js — botón Google con autenticación real (sin texto)
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { iniciarSesion } from "./api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);

  // =============================
  // 🎨 FONDO CON POLÍGONOS
  // =============================
  useEffect(() => {
    const canvas = canvasRef.current;
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

  // =============================
  // 🔐 LOGIN NORMAL
  // =============================
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await iniciarSesion({ email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (typeof setToken === "function") setToken(data.token);
        window.location.replace("/muro");
      } else {
        setMessage(`❌ ${data.message || "Error al iniciar sesión"}`);
      }
    } catch (error) {
      setMessage("❌ Error al conectar con el servidor");
    }
  };

  // =============================
  // 🔐 LOGIN CON GOOGLE
  // =============================
  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const decoded = jwtDecode(credentialResponse.credential);
        const userData = {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        };
        // Guarda token o llama a tu backend si lo necesitas
        localStorage.setItem("googleUser", JSON.stringify(userData));
        if (typeof setToken === "function") setToken(credentialResponse.credential);
        window.location.replace("/muro");
      } catch (err) {
        console.error("Error decodificando token:", err);
      }
    },
    onError: () => {
      setMessage("❌ Error al iniciar sesión con Google");
    },
  });

  // =============================
  // 💻 INTERFAZ
  // =============================
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

        {/* ✅ BOTÓN GOOGLE CON G REAL Y LOGIN FUNCIONAL */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => login()}
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
              e.currentTarget.style.boxShadow =
                "0 0 25px rgba(0,200,255,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 0 15px rgba(0,170,255,0.3)";
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              style={{ width: "22px", height: "22px", display: "block" }}
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.94 0 6.61 1.69 8.12 3.1l5.9-5.9C34.3 3.42 29.62 1.5 24 1.5 14.94 1.5 7.12 7.16 3.72 15.08l6.84 5.32C11.8 14.52 17.4 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.5 24.5c0-1.57-.14-3.07-.41-4.5H24v9h12.65c-.55 2.9-2.18 5.36-4.65 7.03l7.16 5.55C43.5 37.57 46.5 31.54 46.5 24.5z"
              />
              <path
                fill="#4A90E2"
                d="M10.56 28.91a14.41 14.41 0 0 1-.76-4.41c0-1.53.27-3.01.76-4.41l-6.84-5.32A22.96 22.96 0 0 0 1.5 24.5c0 3.62.87 7.04 2.42 10.04l6.64-5.63z"
              />
              <path
                fill="#FBBC05"
                d="M24 46.5c5.62 0 10.34-1.86 13.78-5.04l-7.16-5.55C28.78 37.35 26.49 38 24 38c-6.6 0-12.2-5.02-13.44-11.9l-6.84 5.32C7.12 40.84 14.94 46.5 24 46.5z"
              />
            </svg>
          </button>
        </div>

        <p style={{ color: "#00aaff", marginTop: "15px" }}>{message}</p>
      </div>
    </div>
  );
}

export default Login;
