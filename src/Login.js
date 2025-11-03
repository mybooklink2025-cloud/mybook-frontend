// src/Login.js
/* eslint-disable react-hooks/exhaustive-deps */
/* global google */
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { iniciarSesion } from "./api";

/**
 * Login.js
 * - Mantiene el fondo con polígonos como lo tenías.
 * - Renderiza el botón oficial de Google (solo la G) usando la librería `google.accounts.id`.
 * - Usa callback que llama a handleGoogleSuccess (misma lógica que tenías).
 * - No usa <GoogleLogin /> de @react-oauth/google aquí para evitar diferencias de versión.
 *
 * Requisitos:
 * - Tener REACT_APP_GOOGLE_CLIENT_ID configurada en .env (o en Vercel env vars).
 */

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);
  const googleButtonRef = useRef(null);
  const scriptRef = useRef(null);

  // -------------------------
  // Fondo (polígonos) - idéntico a tu versión previa
  // -------------------------
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

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // -------------------------
  // Login normal (email/password) - sin cambios
  // -------------------------
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
      console.error(error);
    }
  };

  // -------------------------
  // Mismo handler de Google que tenías — mantiene comportamiento exacto
  // -------------------------
  const handleGoogleCredential = (credentialResponse) => {
    try {
      // credentialResponse is the object from google.accounts.id
      // it contains { credential } (a JWT)
      const credential = credentialResponse?.credential || credentialResponse;
      if (!credential) {
        setMessage("❌ No se recibió credential de Google");
        return;
      }
      const decoded = jwtDecode(credential);
      console.log("✅ Usuario Google:", decoded);
      localStorage.setItem("token", credential);
      if (typeof setToken === "function") setToken(credential);
      window.location.replace("/muro");
    } catch (err) {
      console.error("Error decodificando token Google:", err);
      setMessage("❌ Error al procesar credencial de Google");
    }
  };

  // -------------------------
  // Carga y render del botón oficial de Google (solo la G)
  // -------------------------
  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("REACT_APP_GOOGLE_CLIENT_ID no está definido");
      return;
    }

    // crear script (si no existe)
    if (!document.querySelector('script[data-google-one-tap]')) {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.setAttribute("data-google-one-tap", "true");
      document.body.appendChild(s);
      scriptRef.current = s;
      s.onload = () => {
        if (window.google && google.accounts && google.accounts.id) {
          // initialize
          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredential,
          });
          // render button into our wrapper with text='' (no text), shape circle
          if (googleButtonRef.current) {
            google.accounts.id.renderButton(googleButtonRef.current, {
              theme: "outline",
              size: "large",
              shape: "circle",
              text: "", // solicitamos sin texto
              logo_alignment: "center",
            });
            // optionally remove the badge if present
            google.accounts.id.disableAutoSelect();
          }
        }
      };
    } else {
      // already loaded: render immediately if google available
      if (window.google && google.accounts && google.accounts.id && googleButtonRef.current) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredential,
        });
        google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          shape: "circle",
          text: "",
          logo_alignment: "center",
        });
        google.accounts.id.disableAutoSelect();
      }
    }

    // cleanup: remove script and button on unmount
    return () => {
      try {
        if (scriptRef.current && scriptRef.current.parentNode) {
          scriptRef.current.parentNode.removeChild(scriptRef.current);
        }
        // clear any rendered button content
        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = "";
        }
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // -------------------------
  // UI (igual que tu versión)
  // -------------------------
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

        {/* Google button wrapper: the official button will be rendered inside here */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <div ref={googleButtonRef} aria-hidden="false" />
        </div>

        <p style={{ color: "#00aaff", marginTop: "15px" }}>{message}</p>
      </div>
    </div>
  );
}

export default Login;
