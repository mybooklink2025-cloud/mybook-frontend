// ✅ Login.js — versión final con fondo azul-negro brillante
// + ajuste seguro para mostrar SOLO la "G" del botón Google (sin texto)
import React, { useState, useEffect, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { iniciarSesion } from "./api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);
  const googleWrapRef = useRef(null); // ref para actuar sobre el botón de Google

  // =============================
  // 🎨 EFECTO DE FONDO CON POLÍGONOS
  // =============================
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
      // 🌌 Fondo azul-negro (más claro para resaltar los polígonos)
      const g = ctx.createRadialGradient(
        w * 0.3,
        h * 0.2,
        0,
        w / 2,
        h / 2,
        Math.max(w, h)
      );
      g.addColorStop(0, "#0d1b3a");   // azul oscuro
      g.addColorStop(0.5, "#081326"); // intermedio
      g.addColorStop(1, "#01060f");   // casi negro
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
  // 🔐 LÓGICA DE LOGIN
  // =============================
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

  // =============================
  // 🔧 Post-mount: dejar solo la "G" en el botón de Google
  // =============================
  useEffect(() => {
    // pequeña función segura que elimina/oculta SOLO el texto del botón manteniendo el icono y listeners
    const cleanup = () => {
      try {
        const wrap = googleWrapRef.current;
        if (!wrap) return;

        // buscamos el botón real generado por la librería
        const btn = wrap.querySelector('[role="button"], button, div[data-testid]') || wrap.querySelector('button');
        if (!btn) return;

        // 1) ocultar nodos de texto directos
        for (const node of Array.from(btn.childNodes)) {
          // si es nodo de texto y tiene contenido, lo removemos
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            node.textContent = "";
          }
          // si es un <span> que contiene texto (y no contiene SVG), esconderlo
          if (node.nodeType === 1 && node.tagName === "SPAN") {
            const span = node;
            const hasSvg = !!span.querySelector("svg");
            if (!hasSvg && span.innerText.trim().length > 0) {
              span.style.display = "none";
            }
          }
        }

        // 2) forzamos tamaño circular y estilos seguros (sin tocar listeners)
        btn.style.borderRadius = "50%";
        btn.style.width = "48px";
        btn.style.height = "48px";
        btn.style.display = "inline-flex";
        btn.style.alignItems = "center";
        btn.style.justifyContent = "center";
        btn.style.overflow = "hidden";
        btn.style.boxShadow = "0 0 12px rgba(0,150,255,0.28)";
        btn.style.transition = "transform 0.18s ease, box-shadow 0.18s ease";
        // hover visual (no rompe funcion)
        btn.addEventListener("mouseover", () => {
          btn.style.transform = "scale(1.12)";
          btn.style.boxShadow = "0 0 20px rgba(0,200,255,0.45)";
        });
        btn.addEventListener("mouseout", () => {
          btn.style.transform = "scale(1)";
          btn.style.boxShadow = "0 0 12px rgba(0,150,255,0.28)";
        });

        // si por alguna razón hay un span con el logo SVG, nos aseguramos de centrarlo
        const svgSpan = btn.querySelector("svg") ? btn.querySelector("svg").closest("span") : null;
        if (svgSpan) {
          svgSpan.style.display = "inline-flex";
          svgSpan.style.alignItems = "center";
          svgSpan.style.justifyContent = "center";
        }
      } catch (e) {
        // no rompe la app si algo falla aquí; solo logueamos
        // console.warn("No se pudo transformar el botón de Google:", e);
      }
    };

    // run after a short timeout to ensure the button finished rendering
    const t = setTimeout(cleanup, 300);
    return () => clearTimeout(t);
  }, []);

  // =============================
  // 🧩 INTERFAZ VISUAL DEL LOGIN
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
      {/* Fondo animado */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />

      {/* Cuadro del formulario */}
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

        {/* 🔹 Botón de Google (solo logo) */}
        <div style={{ marginTop: "20px" }} ref={googleWrapRef}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <p style={{ color: "#00aaff", marginTop: "15px" }}>{message}</p>
      </div>
    </div>
  );
}

export default Login;
