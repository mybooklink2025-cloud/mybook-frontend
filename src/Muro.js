import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Muro.css";

function Muro() {
  const navigate = useNavigate();

  const [publicaciones, setPublicaciones] = useState([
    { id: 1, autor: "Alejo", texto: "¡Bienvenidos al nuevo muro de MyBook!", foto: "https://cdn-icons-png.flaticon.com/512/194/194938.png" },
    { id: 2, autor: "Martin", texto: "Este es el primer paso hacia la versión real 💙", foto: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png" },
    { id: 3, autor: "MyBook Team", texto: "Próximamente podrás publicar, comentar y reaccionar 🚀", foto: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png" },
  ]);

  const [nuevoPost, setNuevoPost] = useState("");
  const [nombreUsuario] = useState("Usuario Actual");
  const [fotoUsuario] = useState("https://cdn-icons-png.flaticon.com/512/847/847969.png");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const menuRef = useRef(null);
  const sidebarRef = useRef(null);

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

  const logoClick = () => navigate("/muro");

  const linksFijos = [
    { nombre: "Facebook", url: "https://facebook.com" },
    { nombre: "Instagram", url: "https://instagram.com" },
    { nombre: "TikTok", url: "https://www.tiktok.com" },
    { nombre: "X (Twitter)", url: "https://x.com" },
    { nombre: "Noticias", url: "https://www.bbc.com" },
    { nombre: "Juegos", url: "https://www.miniclip.com" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuVisible(false);
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) setSidebarVisible(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="muro-page">
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
        {/* Izquierda: logo y buscador */}
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

        {/* Centro */}
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/profile" style={{ color: "#0d47a1", textDecoration: "none", fontWeight: "bold" }}>Perfil</a>
          <a href="/contactanos" style={{ color: "#0d47a1", textDecoration: "none", fontWeight: "bold" }}>Contáctanos</a>
          <span onClick={() => navigate("/chat")} style={{ color: "#0d47a1", fontWeight: "bold", cursor: "pointer" }}>Chat</span>
        </div>

        {/* Derecha */}
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

          {/* ⚙️ Rueda */}
          <div style={{ position: "relative" }} ref={menuRef}>
            <span
              onClick={() => setMenuVisible(!menuVisible)}
              style={{ fontSize: "22px", cursor: "pointer", color: "#0d47a1" }}
            >
              ⚙️
            </span>

            {menuVisible && (
              <div
                style={{
                  position: "absolute",
                  top: "35px",
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  width: "220px",
                  zIndex: 2000,
                  padding: "10px",
                }}
              >
                <div style={{ textAlign: "center", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
                  <img src={fotoUsuario} alt="Usuario" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                  <p style={{ fontSize: "14px", color: "#555" }}>
                    {localStorage.getItem("email") || "usuario@mybook.com"}
                  </p>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Tu cuenta</li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Configuración</li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Ayuda</li>
                  <li
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/");
                    }}
                    style={{
                      padding: "8px",
                      color: "red",
                      cursor: "pointer",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    Salir
                  </li>
                </ul>
              </div>
            )}
          </div>

          <span
            onClick={() => navigate("/chat")}
            style={{ fontSize: "22px", cursor: "pointer", color: "#0d47a1" }}
          >
            💬
          </span>
        </div>
      </div>

      {/* 🔹 Contenido principal */}
      <div style={{ marginTop: "80px" }}>
        {/* 🍔 Botón de hamburguesa */}
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: sidebarVisible ? "260px" : "10px",
            zIndex: 1100,
            transition: "left 0.3s ease",
          }}
        >
          <div
            onClick={() => setSidebarVisible(!sidebarVisible)}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "3px",
              width: "25px",
              height: "25px",
              backgroundColor: "white",
              borderRadius: "4px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              padding: "3px",
            }}
          >
            <div style={{ width: "22px", height: "2px", backgroundColor: "blue" }}></div>
            <div style={{ width: "22px", height: "2px", backgroundColor: "blue" }}></div>
            <div style={{ width: "22px", height: "2px", backgroundColor: "blue" }}></div>
          </div>
        </div>

        {/* Barra lateral */}
        <div
          ref={sidebarRef}
          className="sidebar"
          style={{
            position: "fixed",
            top: "80px",
            left: sidebarVisible ? "0" : "-250px",
            width: "250px",
            height: "100%",
            backgroundColor: "white",
            boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
            transition: "left 0.3s ease",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <h3>Enlaces rápidos</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {linksFijos.map((link) => (
              <li key={link.nombre} style={{ marginBottom: "10px" }}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "none", fontWeight: "bold" }}>
                  {link.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 🧱 CONTENIDO CENTRAL CENTRADO */}
        <div
          className="main-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            marginLeft: sidebarVisible ? "250px" : "0",
            transition: "margin-left 0.3s ease",
          }}
        >
          <h1>
            <span onClick={logoClick} style={{ color: "blue", textDecoration: "none", cursor: "pointer" }}>
              MyBook
            </span>
          </h1>

          <h2>🌎 Muro general</h2>

          {/* Nueva publicación */}
          <form onSubmit={handlePublicar} className="post-box" style={{ textAlign: "center" }}>
            <textarea
              value={nuevoPost}
              onChange={(e) => setNuevoPost(e.target.value)}
              placeholder="¿Qué estás pensando?"
              rows={3}
              cols={60}
              style={{ resize: "none" }}
            />
            <br />
            <button type="submit">Publicar</button>
          </form>

          {/* Lista de publicaciones */}
          <div className="posts-list" style={{ width: "100%", maxWidth: "600px" }}>
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

          {/* Redes sociales */}
          <div className="social-footer" style={{ marginTop: "20px" }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘 Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸 Instagram</a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">🎵 TikTok</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">🐦 X (Twitter)</a>
            <a href="https://wa.me/573024502105" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Muro;
