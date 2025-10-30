import React, { useState, useEffect, useRef } from "react";
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

  // Obtener correo desde localStorage
  const [correoUsuario, setCorreoUsuario] = useState("");
  useEffect(() => {
    const correo = localStorage.getItem("email") || "usuario@mybook.com";
    setCorreoUsuario(correo);
  }, []);

  // Toggle del sidebar
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  // Toggle del menú de configuración
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      {/* Botón hamburguesa */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "15px",
          left: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          zIndex: 1001,
        }}
      >
        <div style={{ width: "25px", height: "3px", backgroundColor: "blue", margin: "4px 0" }}></div>
        <div style={{ width: "25px", height: "3px", backgroundColor: "blue", margin: "4px 0" }}></div>
        <div style={{ width: "25px", height: "3px", backgroundColor: "blue", margin: "4px 0" }}></div>
      </button>

      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          transform: sidebarVisible ? "translateX(0)" : "translateX(-110%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <h3>Enlaces rápidos</h3>
        <ul>
          {linksFijos.map((link) => (
            <li key={link.nombre}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="main-content" style={{ position: "relative" }}>
        {/* Barra superior */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          <h1>
            <span
              onClick={logoClick}
              style={{ color: "blue", textDecoration: "none", cursor: "pointer" }}
            >
              MyBook
            </span>
          </h1>

          {/* Ícono de configuración */}
          <div style={{ position: "relative" }} ref={menuRef}>
            <span
              onClick={toggleMenu}
              style={{
                fontSize: "24px",
                cursor: "pointer",
                color: "blue",
              }}
            >
              ⚙️
            </span>

            {/* Menú desplegable */}
            {menuVisible && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "40px",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  padding: "15px",
                  width: "220px",
                  zIndex: 2000,
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                  <img
                    src={fotoUsuario}
                    alt="usuario"
                    style={{ width: "60px", borderRadius: "50%" }}
                  />
                  <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
                    {correoUsuario}
                  </p>
                </div>
                <hr />
                <p style={{ cursor: "pointer", margin: "8px 0" }}>Tu cuenta</p>
                <p style={{ cursor: "pointer", margin: "8px 0" }}>Configuración</p>
                <p style={{ cursor: "pointer", margin: "8px 0" }}>Ayuda</p>
                <p
                  onClick={() => navigate("/")}
                  style={{
                    cursor: "pointer",
                    margin: "8px 0",
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Salir
                </p>
              </div>
            )}
          </div>
        </div>

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
