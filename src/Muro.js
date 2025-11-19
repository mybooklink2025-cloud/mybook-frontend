import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Muro.css";

function Muro() {
  const navigate = useNavigate();

  // 📦 Estado de publicaciones
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

  // 🔹 Cerrar menú y barra lateral si haces clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="muro-page">
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

  {/* 🔹 Derecha: ícono de lupa */}
  <div style={{ fontSize: "26px", cursor: "pointer", color: "#0d47a1", alignItems: "center", }}>
    🔍
  </div>

  {/* 🔹 Izquierda: LOGO M */}
  <div
    style={{
      backgroundColor: "blue",
      color: "white",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "left",
      justifyContent: "left",
      fontWeight: "bold",
      fontSize: "22px",
      cursor: "pointer",
    }}
    onClick={logoClick}
  >
    M
  </div>

  {/* 🔹 Derecha: contactos + rueda + (chat eliminado aquí) */}
  <div style={{ display: "flex", alignItems: "center", gap: "20px", marginRight: "40px", }}>
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

    {/* ⚙️ Menú de configuración */}
    <div style={{ position: "relative" }} ref={menuRef}>
      <span
        onClick={() => setMenuVisible(!menuVisible)}
        style={{
          fontSize: "22px",
          cursor: "pointer",
          color: "#0d47a1",
        }}
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
          <div
            style={{
              textAlign: "center",
              borderBottom: "1px solid #ddd",
              paddingBottom: "8px",
            }}
          >
            <img
              src={fotoUsuario}
              alt="Usuario"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
            <p style={{ fontSize: "14px", color: "#555" }}>
              {localStorage.getItem("email") || "usuario@mybook.com"}
            </p>
          </div>

          {/* 📌 Enlaces movidos dentro del menú */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            >
              Perfil
            </li>
            <li
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => navigate("/contactanos")}
            >
              Contáctanos
            </li>
            <li
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => navigate("/chat")}
            >
              Chat
            </li>

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
  </div>
</div>

      {/* 🔹 Contenido principal (desplazado hacia abajo por la barra) */}
      <div style={{ marginTop: "80px" }}>
{/* 🔹 BARRA LATERAL FIJA CON ICONOS REALMENTE FUNCIONALES */}
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
        {
            title: "Google",
            url: "https://www.google.com",
            icon: "https://www.google.com/favicon.ico"
        },
{
    title: "YouTube",
    url: "https://www.youtube.com",
    icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
},        {
            title: "Spotify",
            url: "https://open.spotify.com",
            icon: "https://cdn-icons-png.flaticon.com/512/174/174872.png"
        },
        {
            title: "Noticias",
            url: "https://news.google.com",
            icon: "https://cdn-icons-png.flaticon.com/512/2965/2965879.png"
        },
        {
            title: "Clima",
            url: "https://weather.com",
            icon: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"
        },
        {
            title: "Juegos (Poki)",
            url: "https://poki.com/es",
            icon: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
        },
    ].map((item, index) => (
        <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.title}
            style={{
                width: "40px",
                height: "40px",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease, filter 0.3s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.3)";
                e.currentTarget.style.filter = "drop-shadow(0 0 6px white)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.filter = "none";
            }}
        >
            <img
                src={item.icon}
                alt={item.title}
                style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    objectFit: "contain",
                }}
            />
        </a>
    ))}
</div>

        {/* 🧱 Contenido principal centrado */}
        <div
          className="main-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            textAlign: "center",
            marginLeft: "240px", // 🔹 alineado con “Contáctanos”
            transition: "margin 0.3s ease",
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

          <h2>🌎 Muro general</h2>

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
    </div>
  );
}

export default Muro;
