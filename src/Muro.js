import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Muro.css"; // lo dejamos por compatibilidad, pero la animación está inline en este archivo

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

  // estados nuevos para la animación del logo/libro
  const [logoExpanded, setLogoExpanded] = useState(false); // controla la expansión del logo (M -> MyBook)
  const [bookRebel, setBookRebel] = useState(false); // controla el "rebel" movimiento cuando se pasa por el libro

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

      {/* 🌌 Fondo degradado */}
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

      {/* ===================== BARRA SUPERIOR FIJA ===================== */}
      <div
        className="top-bar"
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
          overflow: "visible", // importante para que la animación no corte
        }}
      >
        {/* LEFT: Logo + animaciones */}
        <div
          className="logo-area"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            // mantener espacio para que no empuje contenido
            minWidth: "60px",
          }}
          // ponemos handlers en el contenedor para que la expansión y el libro no se cierren al mover de uno a otro
          onMouseEnter={() => setLogoExpanded(true)}
          onMouseLeave={() => {
            setLogoExpanded(false);
            setBookRebel(false);
          }}
        >
          {/* Logo expandible: de círculo a contenedor con texto */}
          <div
            className={`logo-button ${logoExpanded ? "expanded" : ""}`}
            onClick={logoClick}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              cursor: "pointer",
              position: "relative",
              zIndex: 1200,
              height: "40px",
              // el ancho cambia con la clase CSS
              padding: "0 10px",
              transition: "width 220ms ease, border-radius 220ms ease, background-color 220ms",
              backgroundColor: logoExpanded ? "white" : "blue",
              color: logoExpanded ? "#0d47a1" : "white",
              borderRadius: logoExpanded ? "12px" : "50%",
              width: logoExpanded ? "150px" : "40px",
              boxShadow: logoExpanded ? "0 4px 12px rgba(0,0,0,0.12)" : "none",
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            <div style={{ width: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "22px", pointerEvents: "none" }}>M</span>
            </div>

            {/* Texto que aparece al expandir */}
            <div
              style={{
                marginLeft: "8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                transformOrigin: "left center",
                transition: "opacity 180ms ease, transform 180ms ease",
                opacity: logoExpanded ? 1 : 0,
                transform: logoExpanded ? "translateX(0) scaleX(1)" : "translateX(-6px) scaleX(0.9)",
                color: "#0d47a1",
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              <span>yBook</span>
            </div>
          </div>

          {/* Libro animado - posicionado dentro de la barra a la derecha del logo. No debe empujar nada. */}
          <div
            className={`book-icon ${bookRebel ? "rebel" : ""}`}
            style={{
              position: "absolute",
              left: logoExpanded ? "170px" : "60px", // se desplaza ligeramente según la expansión
              top: "6px",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
              zIndex: 1150,
              transition: "left 200ms ease",
            }}
            // si el usuario pasa por el libro, se activa el efecto "rebelde"
            onMouseEnter={() => setBookRebel(true)}
            onMouseLeave={() => setBookRebel(false)}
            onClick={(e) => {
              // prevenimos que el click en el libro active el logo
              e.stopPropagation();
            }}
            title="Libro MyBook"
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                // fondo translúcido para estilo
                background: "linear-gradient(180deg, rgba(63,140,255,0.12), rgba(63,140,255,0.06))",
                filter: "drop-shadow(0 4px 12px rgba(63,140,255,0.18))",
                transformOrigin: "center",
                // la animación por defecto
                animation: bookRebel ? "rebelMove 650ms ease-in-out infinite" : "floatBook 2000ms ease-in-out infinite",
                cursor: "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* imagen del libro */}
              <img
                src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
                alt="Libro animado"
                style={{
                  width: "28px",
                  height: "28px",
                  transform: bookRebel ? "translateX(6px) rotate(-6deg) scale(1.06)" : "translateX(0) rotate(0deg)",
                  transition: "transform 200ms ease",
                  // añadir brillo
                  filter: "drop-shadow(0 6px 14px rgba(63,140,255,0.25))",
                }}
                draggable={false}
              />
            </div>

            {/* partículas / brillo extra (elemento visual, no interactivo) */}
            <div style={{
              position: "absolute",
              width: "120px",
              height: "40px",
              left: "48px",
              top: "-6px",
              pointerEvents: "none",
              zIndex: 1140,
              opacity: logoExpanded ? 1 : 0,
              transition: "opacity 220ms ease",
            }}>
              {/* pequeñas bolitas hechas con box-shadow en pseudo estilo */}
              <div style={{
                position: "absolute",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "rgba(63,140,255,0.85)",
                boxShadow: "0 0 10px rgba(63,140,255,0.9), 20px 4px 8px rgba(63,140,255,0.4), 40px -6px 6px rgba(63,140,255,0.25)",
                left: "8px",
                top: "12px",
                transform: "translateY(0)",
                animation: "sparkle 1800ms linear infinite",
                opacity: 0.95,
              }} />
            </div>
          </div>
        </div>

        {/* centro vacío para mantener diseño */}
        <div style={{ flex: 1 }}></div>

        {/* RIGHT: íconos y menú (sin tocar) */}
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

                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => navigate("/profile")}>Perfil</li>
                  <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => navigate("/contactanos")}>Contáctanos</li>
                  <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => navigate("/chat")}>Chat</li>

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

      {/* ===================== Estilos CSS en bloque (no tocan tu CSS externo) ===================== */}
      <style>
        {`
          /* animaciones del libro */
          @keyframes floatBook {
            0% { transform: translateY(0) rotate(0deg); }
            30% { transform: translateY(-6px) rotate(-2deg); }
            60% { transform: translateY(-2px) rotate(1deg); }
            100% { transform: translateY(0) rotate(0deg); }
          }

          @keyframes rebelMove {
            0% { transform: translate(0,0) rotate(0deg) scale(1); }
            25% { transform: translate(-18px,-6px) rotate(-8deg) scale(1.06); }
            50% { transform: translate(24px,8px) rotate(8deg) scale(1.04); }
            75% { transform: translate(-8px,6px) rotate(-6deg) scale(1.08); }
            100% { transform: translate(0,0) rotate(0deg) scale(1); }
          }

          @keyframes sparkle {
            0% { transform: translateY(0) scale(1); opacity: 0.95; }
            50% { transform: translateY(-6px) scale(1.1); opacity: 0.6; }
            100% { transform: translateY(0) scale(1); opacity: 0.95; }
          }

          /* clases para controlar comportamiento */
          .logo-button.expanded {
            /* estilos adicionales si quieres personalizar por clase */
          }

          .book-icon.rebel > div {
            /* cambia la animación al estado rebel */
            animation: rebelMove 700ms ease-in-out infinite;
          }

          /* evitar que el logo expandido sea seleccionado por el usuario accidentalmente */
          .logo-button, .logo-button * {
            user-select: none;
          }

          /* accesibilidad: cuando el contenedor tenga focus (keyboard), simular hover */
          .logo-area:focus-within .logo-button {
            outline: none;
            box-shadow: 0 0 0 3px rgba(13,71,161,0.08);
          }
        `}
      </style>

      {/* ===================== CONTENIDO PRINCIPAL ===================== */}
      <div style={{ marginTop: "80px" }}>

        {/* BARRA LATERAL (igual que antes) */}
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
            { title: "Google", url: "https://www.google.com", icon: "https://www.google.com/favicon.ico" },
            { title: "YouTube", url: "https://www.youtube.com", icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png" },
            { title: "Spotify", url: "https://open.spotify.com", icon: "https://cdn-icons-png.flaticon.com/512/174/174872.png" },
            { title: "Noticias", url: "https://news.google.com", icon: "https://cdn-icons-png.flaticon.com/512/2965/2965879.png" },
            { title: "Clima", url: "https://weather.com", icon: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png" },
            { title: "Juegos (Poki)", url: "https://poki.com/es", icon: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png" },
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

        {/* CONTENIDO CENTRAL (sin cambios en estructura: no se debe mover ni agrandar) */}
        <div
          className="main-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            textAlign: "center",
            marginLeft: "240px", // deja tu layout como estaba
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
          <div className="posts-list" style={{ width: "760px", maxWidth: "92%" }}>
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
          <div className="social-footer" style={{ marginTop: "30px" }}>
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
