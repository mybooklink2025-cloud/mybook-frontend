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

  const [showBook, setShowBook] = useState(false);

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
        {/* 🔹 Izquierda: LOGO M + libro animado */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            onClick={logoClick}
            style={{
              backgroundColor: "blue",
              color: "white",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "22px",
              cursor: "pointer",
              position: "relative",
              zIndex: 2,
            }}
            onMouseEnter={() => setShowBook(true)}
            onMouseLeave={() => setShowBook(false)}
          >
            M
          </div>

          {showBook && (
            <div
              style={{
                position: "absolute",
                left: "-70px",
                top: "0px",
                width: "50px",
                height: "50px",
                animation: "floatBook 1.5s ease-in-out infinite",
                filter: "drop-shadow(0px 0px 8px #3f8cff)",
                opacity: 1,
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
                alt="Libro animado"
                style={{
                  width: "50px",
                  height: "50px",
                }}
              />
            </div>
          )}
        </div>

        <div></div>

        {/* 🔹 Centro: enlaces */}
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

        {/* 🔹 Derecha */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginRight: "40px",
          }}
        >
          <div
            style={{
              fontSize: "26px",
              cursor: "pointer",
              color: "#0d47a1",
            }}
          >
            🔍
          </div>

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

      <style>
        {`
          @keyframes floatBook {
            0% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>

      {/* 🔹 BARRA LATERAL FIJA CON ICONOS */}
      <div
        style={{
          position: "fixed",
          top: "60px",
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
        {[
          { icon: "🌐", url: "https://www.google.com", title: "Google" },
          { icon: "🎬", url: "https://www.youtube.com", title: "YouTube" },
          { icon: "🎵", url: "https://open.spotify.com", title: "Spotify" },
          { icon: "📰", url: "https://news.google.com", title: "Noticias" },
          { icon: "☁️", url: "https://weather.com", title: "Clima" },
          { icon: "🕹️", url: "https://poki.com/es", title: "Juegos" },
        ].map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.title}
            style={{
              marginBottom: "25px",
              fontSize: "24px",
              textDecoration: "none",
              color: "white",
              transition: "transform 0.3s ease, text-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.4)";
              e.target.style.textShadow = "0 0 8px white";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.textShadow = "none";
            }}
          >
            {item.icon}
          </a>
        ))}
      </div>

      {/* 📨 CONTENIDO PRINCIPAL */}
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