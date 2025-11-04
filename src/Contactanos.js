import React, { useState } from "react";
import { enviarContacto } from "./api";
import { useNavigate } from "react-router-dom";

function Contactanos() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await enviarContacto({ nombre, email, mensaje });
      if (data && (data.message || data.error)) {
        if (data.message && data.message.includes("✅")) {
          setStatus(data.message);
          setNombre("");
          setEmail("");
          setMensaje("");
        } else {
          setStatus(`❌ ${data.message || data.error || "Error"}`);
        }
      } else {
        setStatus("✅ Mensaje enviado correctamente");
        setNombre("");
        setEmail("");
        setMensaje("");
      }
    } catch (err) {
      setStatus("❌ Error al conectar con el servidor");
    }
  };

  const logoClick = () => {
    navigate(token ? "/muro" : "/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* 🌌 Fondo degradado sin polígonos */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at 30% 20%, #0d1b3a 0%, #081326 50%, #01060f 100%)",
        zIndex: -1,
      }}
    ></div>
      <h1>
        <span
          onClick={logoClick}
          style={{ color: "blue", textDecoration: "none", cursor: "pointer" }}
        >
          MyBook - Contáctanos
        </span>
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "inline-block", textAlign: "left" }}
      >
        <label>Nombre:</label>
        <br />
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <br /><br />

        <label>Correo:</label>
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <label>Mensaje:</label>
        <br />
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={4}
          cols={30}
          required
        />
        <br /><br />

        <button type="submit">Enviar</button>
      </form>

      <p style={{ color: "blue", marginTop: "10px" }}>{status}</p>

      {/* Enlace directo a WhatsApp */}
      <p style={{ marginTop: "20px" }}>
        <a
          href="https://wa.me/573233694655"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          Escríbenos por WhatsApp 📱
        </a>
      </p>
    </div>
  );
}

export default Contactanos;
