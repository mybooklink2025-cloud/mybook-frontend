import React, { useState, useEffect, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { iniciarSesion } from "./api";

/**
 * Login con canvas propio que dibuja polígonos hexagonales conectados
 * Efecto neón, reacciona al mouse. No requiere react-tsparticles ni tsparticles.
 */

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, radius: 120 });

  // --- login logic (sin cambios) ---
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

  // --- canvas animation ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // particle model
    const PARTICLE_COUNT = Math.round((Math.max(w, h) / 100) * 6); // adaptativo
    const HEX_SIDES = 6;
    const COLOR = { r: 0, g: 170, b: 255 }; // #00aaff

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function dist(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // create hexagon path at x,y with radius
    function drawHexagon(ctx, x, y, radius, rotation = 0) {
      ctx.beginPath();
      for (let i = 0; i < HEX_SIDES; i++) {
        const angle = (Math.PI * 2 * i) / HEX_SIDES + rotation;
        const vx = x + Math.cos(angle) * radius;
        const vy = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    }

    function createParticles() {
      const arr = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = rand(2, 5);
        arr.push({
          x: rand(size, w - size),
          y: rand(size, h - size),
          vx: rand(-0.4, 0.4),
          vy: rand(-0.4, 0.4),
          size,
          rotation: rand(0, Math.PI * 2),
          rotSpeed: rand(-0.01, 0.01),
        });
      }
      particlesRef.current = arr;
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      // recreate to adapt
      createParticles();
    }

    function updateAndDraw() {
      ctx.clearRect(0, 0, w, h);

      // soft background to avoid pure black (so polygons stand out)
      // draw a subtle radial gradient background
      const g = ctx.createRadialGradient(w * 0.3, h * 0.2, 0, w / 2, h / 2, Math.max(w, h));
      g.addColorStop(0, "#07142b");
      g.addColorStop(0.5, "#000814");
      g.addColorStop(1, "#000000");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;

      // move
      for (let p of particles) {
        // interaction with mouse: repulse
        if (mouseRef.current.x !== null) {
          const md = dist(p, mouseRef.current);
          if (md < mouseRef.current.radius + 40) {
            const angle = Math.atan2(p.y - mouseRef.current.y, p.x - mouseRef.current.x);
            const force = (mouseRef.current.radius + 40 - md) / (mouseRef.current.radius + 40);
            p.vx += Math.cos(angle) * 0.6 * force;
            p.vy += Math.sin(angle) * 0.6 * force;
          }
        }

        // basic motion + friction
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.rotation += p.rotSpeed;

        // bounds
        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;
        if (p.y < -50) p.y = h + 50;
        if (p.y > h + 50) p.y = -50;
      }

      // draw lines between close particles
      const maxDist = Math.min(200, Math.max(w, h) / 6);
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = dist(a, b);
          if (d < maxDist) {
            const alpha = 0.6 * (1 - d / maxDist);
            ctx.strokeStyle = `rgba(${COLOR.r},${COLOR.g},${COLOR.b},${alpha * 0.6})`;
            ctx.lineWidth = 1;
            // glow
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(${COLOR.r},${COLOR.g},${COLOR.b},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      // draw hexagons on top
      for (let p of particles) {
        const glowAlpha = 0.16 + Math.min(0.6, (p.size / 5) * 0.6);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // neon fill (slight)
        ctx.fillStyle = `rgba(${COLOR.r},${COLOR.g},${COLOR.b},${0.07 + glowAlpha})`;
        ctx.strokeStyle = `rgba(${COLOR.r},${COLOR.g},${COLOR.b},${0.9})`;
        ctx.lineWidth = 1;
        // shadow (neon)
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(${COLOR.r},${COLOR.g},${COLOR.b},0.75)`;
        drawHexagon(ctx, 0, 0, p.size * 2.2, 0);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      animationId = requestAnimationFrame(updateAndDraw);
    }

    // init
    createParticles();
    window.addEventListener("resize", resize);

    // mouse handlers
    function onMove(e) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    function onLeave() {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseout", onLeave);

    updateAndDraw();

    // cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseout", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // --- render ---
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "Inter, Roboto, sans-serif",
        background: "transparent",
      }}
    >
      {/* Canvas en background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          display: "block",
          background: "transparent",
        }}
      />

      {/* Contenedor del login (misma estructura que pediste) */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: 360,
          maxWidth: "92%",
          margin: "8vh auto",
          borderRadius: 14,
          padding: "32px 26px",
          textAlign: "center",
          color: "#fff",
          background: "linear-gradient(180deg, rgba(2,10,28,0.88), rgba(2,6,20,0.76))",
          boxShadow: "0 12px 40px rgba(0,170,255,0.12)",
          border: "1px solid rgba(0,170,255,0.06)",
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

        {/* Google Auth dentro del mismo cuadro, abajo */}
        <div style={{ marginTop: 18 }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        <p style={{ color: "#00b3ff", marginTop: 14 }}>{message}</p>
      </div>
    </div>
  );
}

export default Login;
