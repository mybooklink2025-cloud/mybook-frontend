import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Muro.css";

function Muro() {
  const navigate = useNavigate();

  // Publicaciones iniciales
  const [publicaciones, setPublicaciones] = useState([
    { id: 1, autor: "Alejo", texto: "¡Bienvenidos al nuevo muro de MyBook!", foto: "https://cdn-icons-png.flaticon.com/512/194/194938.png" },
    { id: 2, autor: "Martin", texto: "Este es el primer paso hacia la versión real 💙", foto: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png" },
    { id: 3, autor: "MyBook Team", texto: "Próximamente podrás publicar, comentar y reaccionar 🚀", foto: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png" },
  ]);

  const [nuevoPost, setNuevoPost] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("Usuario Actual");
  const [fotoUsuario, setFotoUsuario] = useState("https://cdn-icons-png.flaticon.com/512/847/847969.png");

  // Por defecto la barra estará oculta
  const [mostrarSidebar, setMostrarSidebar] = useState(false);

  const handlePublicar = (e) => {
    e.preventDefault();
    if (!nuevoPost.trim()) return;
    const nuevo = {
      id: publicaciones.length + 1,
      autor: nombreUsuario,
      texto: nuevoPost,
      foto: fotoUsuario,
    };
    setPublicaciones([nuevo, ...publicaciones]);
    setNuevoPost("");
  };

  const logoClick = () => {
    navigate("/muro");
  };

  // Links para la ventana fija
  const linksFijos = [
    { nombre: "Facebook", url: "https://facebook.com" },
    { nombre: "Instagram", url: "https://instagram.com" },
    { nombre: "TikTok", url: "https://www.tiktok.com" },
    { nombre: "X (Twitter)", url: "https://x.com" },
    { nombre: "Noticias", url: "https://www.bbc.com" },
    { nombre: "Juegos", url: "https://www.miniclip.com" },
  ];

  return (
    <div className="muro-page">

      {/* Botón tipo hamburguesa para mostrar/ocultar la barra lateral */}
      <div
        onClick={() => setMostrarSidebar(!mostrarSidebar)}
        style={{
          position: "fixed",
          top: "15px",
          left: mostrarSidebar ? "220px" : "15px", // 🔹 se separa un poco más cuando la barra está abierta
          width: "35px",
          height: "24px", // 🔹 más compacto
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: "pointer",
          zIndex: 1000,
          transition: "left 0.3s ease",
        }}
      >
        <div style={{ height: "4px", backgroundColor: "blue", borderRadius: "2px" }}></div>
        <div style={{ height: "4px", backgroundColor: "blue", borderRadius: "2px" }}></div>
        <div style={{ height: "4px", backgroundColor: "blue", borderRadius: "2px" }}></div>
      </div>

      {/* Barra lateral (por defecto oculta) */}
      {mostrarSidebar && (
        <div
          className="sidebar"
          style={{
            transition: "all 0.3s ease-in-out",
          }}
        >
          <h3>Enlaces rápidos</h3>
          <ul>
            {linksFijos.map((link) => (
              <li key={link.nombre}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.nombre}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contenido principal desplazable */}
      <div className="main-content">
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

        {/* Navegación superior */}
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

        {/* Nueva publicación */}
        <form onSubmit={handlePublicar} className="post-box">
          <textarea
            value={nuevoPost}
            onChange={(e) => setNuevoPost(e.target.value)}
            placeholder="¿Qué estás pensando?"
            rows={3}
            cols={60}
          />
          <button type="submit">Publicar</button>
        </form>

        {/* Lista de publicaciones */}
        <div className="posts-list">
          {publicaciones.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <img src={post.foto} alt="foto autor" className="post-user-photo" />
                <p className="post-user-name">{post.autor}</p>
              </div>
              <p>{post.texto}</p>
            </div>
          ))}
        </div>

        {/* Redes sociales al pie */}
        <div className="social-footer">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            📘 Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            📸 Instagram
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
            🎵 TikTok
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            🐦 X (Twitter)
          </a>
          <a href="https://wa.me/573024502105" target="_blank" rel="noopener noreferrer">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default Muro;
