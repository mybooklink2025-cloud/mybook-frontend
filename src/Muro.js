import React from "react";
import { useNavigate } from "react-router-dom";

function Muro() {
  const navigate = useNavigate();

  const redes = [
    { nombre: "Facebook", url: "https://facebook.com", color: "blue" },
    { nombre: "Instagram", url: "https://instagram.com", color: "purple" },
    { nombre: "X (Twitter)", url: "https://x.com", color: "black" },
    { nombre: "TikTok", url: "https://www.tiktok.com", color: "darkred" },
  ];

  const publicaciones = [
    { id: 1, autor: "Alejo", texto: "¡Bienvenidos al nuevo muro de MyBook!" },
    { id: 2, autor: "Martin", texto: "Este es el primer paso hacia la versión real 💙" },
    { id: 3, autor: "MyBook Team", texto: "Próximamente podrás publicar, comentar y reaccionar 🚀" },
  ];

  const logoClick = () => {
    navigate("/muro");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Logo principal */}
      <h1>
        <span
          onClick={logoClick}
          style={{ color: "blue", textDecoration: "none", cursor: "pointer" }}
        >
          MyBook
        </span>
      </h1>
      <h2>🌎 Muro general</h2>

      {/* Enlaces superiores */}
      <div style={{ marginBottom: "20px" }}>
        <a
          href="/profile"
          style={{
            color: "blue",
            textDecoration: "underline",
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Perfil
        </a>
        |
        <a
          href="/contactanos"
          style={{
            color: "blue",
            textDecoration: "underline",
            fontWeight: "bold",
            marginLeft: "10px",
          }}
        >
          Contáctanos
        </a>
        |
        <span
          onClick={() => navigate("/chat")}
          style={{
            color: "green",
            textDecoration: "underline",
            fontWeight: "bold",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          Chat
        </span>
      </div>

      {/* Publicaciones simuladas */}
      <div style={{ marginTop: "30px" }}>
        {publicaciones.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              margin: "10px auto",
              width: "60%",
              textAlign: "left",
              backgroundColor: "#f9f9f9",
            }}
          >
            <p style={{ fontWeight: "bold", color: "blue" }}>{post.autor}</p>
            <p>{post.texto}</p>
          </div>
        ))}
      </div>

      {/* Enlaces a redes sociales */}
      <div style={{ marginTop: "40px" }}>
        <h3>Síguenos en redes sociales</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "10px" }}>
          {redes.map((r) => (
            <a
              key={r.nombre}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: r.color,
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {r.nombre}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Muro;
