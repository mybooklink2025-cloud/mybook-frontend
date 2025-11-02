// ✅ Login.js — misma autenticación, botón Google solo con la “G”
import React, { useState, useEffect, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { iniciarSesion } from "./api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);

  // 🎨 Fondo animado (polígonos)
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

  // 🔐 Login manual
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

  // 🔐 Login con Google (original)
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

        {/* ✅ Botón Google original, G brillante */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <div className="google-button-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              shape="circle"
            />
          </div>
        </div>

        <p style={{ color: "#00aaff", marginTop: "15px" }}>{message}</p>
      </div>

      {/* 💎 Solo efecto visual: brillo, pulso y resplandor suave (NO toca la lógica) */}
      <style>{`
        /* Mantener tamaño seguro para que Google devuelva credential correctamente */
        .google-button-wrapper iframe {
          border-radius: 50% !important;
          width: 48px !important;
          height: 48px !important;
          /* brillo base */
          box-shadow: 0 0 18px rgba(0, 170, 255, 0.35), 0 6px 20px rgba(0,0,0,0.35);
          transition: transform 180ms ease, box-shadow 220ms ease, filter 220ms ease;
          /* ligero filtro para dar más "contraste" a la G interna */
          filter: drop-shadow(0 4px 10px rgba(0, 170, 255, 0.25));
        }

        /* Hover: resplandor más potente, sin cambiar comportamiento del iframe */
        .google-button-wrapper iframe:hover {
          transform: scale(1.08);
          box-shadow: 0 0 40px rgba(0, 200, 255, 0.75), 0 10px 30px rgba(0,0,0,0.45);
        }

        /* Animación sutil para hacerlo "vivo" */
        @keyframes gentle-pulse {
          0% {
            box-shadow: 0 0 14px rgba(0, 170, 255, 0.28);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 0 26px rgba(0, 200, 255, 0.48);
            transform: translateY(-1px);
          }
          100% {
            box-shadow: 0 0 18px rgba(0, 170, 255, 0.32);
            transform: translateY(0);
          }
        }
        .google-button-wrapper iframe {
          animation: gentle-pulse 3.5s infinite ease-in-out;
        }

        /* Si por algún motivo el iframe es anclado con border-box, aseguramos padding a la envoltura */
        .google-button-wrapper {
          width: 52px;
          height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: transparent;
        }
      `}</style>
    </div>
  );
}

export default Login;
