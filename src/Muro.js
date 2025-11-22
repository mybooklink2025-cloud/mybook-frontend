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
  const [menuVisible, setMenuVisible] = useState(false);
  const [showFullLogo, setShowFullLogo] = useState(false);

  const [bookPos, setBookPos] = useState({ right: 10 });
  const [showBook, setShowBook] = useState(false);

  const menuRef = useRef(null);

  const logoClick = () => navigate("/muro");

  const randomEscape = () => {
    const randomX = Math.floor(Math.random() * 300) + 50;
    setBookPos({ right: randomX });
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="muro-page">

      {/* FONDO */}
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

      {/* BARRA SUPERIOR */}
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
        {/* LOGO IZQUIERDO */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          
          {/* LOGO BASE M */}
          <div
            onClick={logoClick}
            onMouseEnter={() => {
              setShowFullLogo(true);
              setShowBook(true);
            }}
            onMouseLeave={() => {
              setShowFullLogo(false);
              setShowBook(false);
            }}
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
              transition: "width 0.3s ease",
              overflow: "hidden",
              whiteSpace: "nowrap",
              paddingLeft: "0px",
              paddingRight: showFullLogo ? "10px" : "0px",
              width: showFullLogo ? "140px" : "40px",
            }}
          >
            M
            {showFullLogo && (
              <span style={{ marginLeft: "8px", fontSize: "20px", fontWeight: "bold" }}>
                yBook
              </span>
            )}
          </div>

          {/* LIBRO ANIMADO */}
          {showBook && (
            <img
              src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
              alt="book"
              onMouseEnter={randomEscape}
              style={{
                position: "absolute",
                top: "-5px",
                right: `-${bookPos.right}px`,
                width: "45px",
                height: "45px",
                animation: "floatBook 1.5s ease-in-out infinite",
                filter: "drop-shadow(0px 0px 10px #3f8cff)",
                transition: "right 0.4s ease",
                cursor: "pointer",
              }}
            />
          )}
        </div>

        {/* DERECHA */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginRight: "40px" }}>
          <div style={{ fontSize: "26px", cursor: "pointer", color: "#0d47a1" }}>🔍</div>

          <button style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#0d47a1", fontWeight: "bold"
          }}>
            👥 Mis Contactos
          </button>

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

                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => navigate("/profile")}>Perfil</li>
                  <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => navigate("/contactanos")}>Contáctanos</li>
                  <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => navigate("/chat")}>Chat</li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Configuración</li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Ayuda</li>
                  <li
                    onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
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

      {/* ANIMACIÓN FLOAT */}
      <style>
        {`
          @keyframes floatBook {
            0% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>

      {/* CONTENIDO CENTRAL */}
      <div style={{ marginTop: "80px" }}>

        {/* MAIN CONTENT */}
        <div
          className="main-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1>
            <span onClick={logoClick} style={{ color: "blue", cursor: "pointer" }}>
              MyBook
            </span>
          </h1>

          <h2>🌎 Muro general</h2>

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

          <div className="social-footer">
            <a href="https://facebook.com" target="_blank">📘 Facebook</a>
            <a href="https://instagram.com" target="_blank">📸 Instagram</a>
            <a href="https://www.tiktok.com" target="_blank">🎵 TikTok</a>
            <a href="https://x.com" target="_blank">🐦 X</a>
            <a href="https://wa.me/573024502105" target="_blank">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Muro;
