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
    <div style={{ textAlign: "center", marginTop: "70px", marginLeft: "80px" }}>
      {/* 🌌 Fondo degradado sin polígonos */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background:
            "radial-gradient(circle at 30% 20%, #0d1b3a 0%, #081326 50%, #01060f 100%)",
          zIndex: -1,
        }}
      ></div>

      {/* 🔵 BARRA SUPERIOR FIJA */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#e3f2fd",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        {/* Izquierda: M + buscador */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "blue",
              color: "white",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "20px",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={logoClick}
          >
            M
          </div>
          <input
            type="text"
            placeholder="Buscar en MyBook..."
            style={{
              padding: "6px 10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              width: "250px",
            }}
          />
        </div>

        {/* Centro: enlaces */}
        <div style={{ display: "flex", gap: "20px" }}>
          <a
            href="/profile"
            style={{
              color: "#0d47a1",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Perfil
          </a>
          <a
            href="/contactanos"
            style={{
              color: "#0d47a1",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Contáctanos
          </a>
          <span
            onClick={() => navigate("/chat")}
            style={{
              color: "#0d47a1",
              textDecoration: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Chat
          </span>
        </div>

        {/* Derecha: contactos + rueda */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#0d47a1",
              fontWeight: "bold",
            }}
          >
            👥 Mis Contactos
          </button>

          <span
            style={{
              fontSize: "22px",
              cursor: "pointer",
              color: "#0d47a1",
            }}
          >
            ⚙️
          </span>
        </div>
      </div>

      {/* 🔹 Barra lateral fija con efecto difuminado */}
      <div
        style={{
          position: "fixed",
          top: "60px", // debajo de la barra superior
          left: 0,
          width: "65px",
          height: "100vh",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
          zIndex: 900,
        }}
      >
        <a
          href="/muro"
          title="Inicio"
          style={{
            marginBottom: "25px",
            fontSize: "22px",
            textDecoration: "none",
            color: "white",
          }}
        >
          🏠
        </a>
        <a
          href="/profile"
          title="Perfil"
          style={{
            marginBottom: "25px",
            fontSize: "22px",
            textDecoration: "none",
            color: "white",
          }}
        >
          👤
        </a>
        <a
          href="/chat"
          title="Chat"
          style={{
            marginBottom: "25px",
            fontSize: "22px",
            textDecoration: "none",
            color: "white",
          }}
        >
          💬
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
          style={{
            marginBottom: "25px",
            fontSize: "22px",
            textDecoration: "none",
            color: "white",
          }}
        >
          📘
        </a>
        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          title="TikTok"
          style={{
            marginBottom: "25px",
            fontSize: "22px",
            textDecoration: "none",
            color: "white",
          }}
        >
          🎵
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
          style={{
            marginBottom: "25px",
            fontSize: "22px",
            textDecoration: "none",
            color: "white",
          }}
        >
          📸
        </a>
      </div>

      {/* 📨 Contenido principal */}
      <h1>
        <span
          onClick={logoClick}
          style={{
            color: "white",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          MyBook - Contáctanos
        </span>
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "inline-block", textAlign: "left", color: "white" }}
      >
        <label>Nombre:</label>
        <br />
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <br />
        <br />

        <label>Correo:</label>
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />

        <label>Mensaje:</label>
        <br />
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={4}
          cols={30}
          required
        />
        <br />
        <br />

        <button type="submit">Enviar</button>
      </form>

      <p style={{ color: "lightblue", marginTop: "10px" }}>{status}</p>

      {/* Enlace directo a WhatsApp */}
      <p style={{ marginTop: "20px" }}>
        <a
          href="https://wa.me/573233694655"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "lightblue", textDecoration: "underline" }}
        >
          Escríbenos por WhatsApp 📱
        </a>
      </p>
    </div>
  );
}

export default Contactanos;
