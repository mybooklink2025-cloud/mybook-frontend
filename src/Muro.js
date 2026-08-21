import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Muro.css"; // dejo la importación por compatibilidad con estilos existentes

// Archivo Muro.jsx — Cambios realizados:
// - El logo "M" queda EXACTAMENTE igual por defecto (40x40, círculo azul, M blanca)
// - Al pasar el cursor por el logo, el logo se "extiende" horizontalmente hacia la derecha
//   para mostrar las letras "yBook" dentro del mismo fondo azul (texto blanco), quedando
//   visualmente "junto" como MyBook dentro del área que antes era el círculo.
// - El libro animado aparece EN LA BARRA (fuera del círculo) cuando el usuario activa el logo
//   y permanece visible (no desaparece al quitar el cursor del logo). Al poner el cursor
//   sobre el libro, el mismo "escapa" a otra posición aleatoria dentro de la barra superior.
// - No se modifica la estructura del contenido principal ni de la barra lateral.

function Muro() {
  const navigate = useNavigate();

  // publicaciones (sin cambios)
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

  // NUEVAS ESTADOS
  const [expanded, setExpanded] = useState(false); // cuando true, el logo se extiende y muestra "MyBook" dentro
  const [showBook, setShowBook] = useState(false); // si true, el libro está visible sobre la barra
  const [bookPos, setBookPos] = useState({ left: 0, top: 0 }); // posición absoluta dentro de la barra

  const menuRef = useRef(null);
  const sidebarRef = useRef(null);
  const topBarRef = useRef(null);
  const logoRef = useRef(null);
  const bookRef = useRef(null);

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

  // 🔹 Cerrar menú y barra lateral si haces clic fuera (sin tocar otras cosas)
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

  // Cuando se activa la expansión (hover del logo), calculamos la posición inicial del libro.
  const activateLogo = () => {
    if (!topBarRef.current || !logoRef.current) {
      setExpanded(true);
      setShowBook(true);
      return;
    }

    const barRect = topBarRef.current.getBoundingClientRect();
    const logoRect = logoRef.current.getBoundingClientRect();

    // Posición inicial: al lado derecho del área del logo, dentro de la barra
    const left = logoRect.right - barRect.left + 12; // 12px de separación
    const top = (barRect.height - 48) / 2; // centrar libro (asumiendo 48px altura libro)

    setExpanded(true);
    setShowBook(true);
    setBookPos({ left, top });
  };

  // Función para mover el libro a una posición aleatoria dentro de la barra
  const escapeBook = () => {
    if (!topBarRef.current || !bookRef.current || !logoRef.current) return;
    const barRect = topBarRef.current.getBoundingClientRect();
    const bookRect = bookRef.current.getBoundingClientRect();
    const logoRect = logoRef.current.getBoundingClientRect();

    // áreas permitidas: desde (logo's right + 8px) hasta (barra width - book width - 12px)
    const minLeft = Math.max(logoRect.right - barRect.left + 8, 8);
    const maxLeft = Math.max(barRect.width - bookRect.width - 12, minLeft + 12);

    const randomLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;

    // Mantener top centrado verticalmente
    const top = (barRect.height - bookRect.height) / 2;

    setBookPos({ left: randomLeft, top });
  };

  // Cuando el usuario coloca el cursor sobre el libro, lo hacemos "escapar" inmediatamente.
  const handleBookMouseEnter = () => {
    escapeBook();
  };

  // También dejamos una pequeña animación continua de brillo (CSS inline en el elemento)

  return (
    <div className="muro-page">

      {/* 🌌 Fondo degradado (sin cambios) */}
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
        ref={topBarRef}
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
          overflow: "visible", // para que el libro pueda moverse por encima
        }}
      >

        {/* 🔹 Izquierda: LOGO M + texto extendido (dentro del mismo fondo azul) */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>

          {/* Contenedor que mantiene el círculo exactamente igual por defecto, y se "extiende" sin cambiar la apariencia
              interna de la M (la M siempre se coloca al borde izquierdo). */}
          <div
            ref={logoRef}
            onClick={logoClick}
            onMouseEnter={activateLogo} // cuando el mouse entra se activa (y deja expandido)
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              position: "relative",
              // Layout del contenedor expandible: por defecto 40px (círculo). Cuando expanded=true, se vuelve más ancho
              width: expanded ? 140 : 40,
              height: 40,
              transition: "width 280ms ease, border-radius 280ms ease",
              borderRadius: expanded ? 20 : "50%", // de círculo a 'pill' suave. Visualmente sigue igual en la parte izquierda
              backgroundColor: "#0d47a1", // azul consistente
              color: "white",
              cursor: "pointer",
              overflow: "hidden",
              paddingLeft: 0,
              boxSizing: "border-box",
              zIndex: 2,
            }}
          >
            {!expanded && (
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 22,
                  userSelect: "none",
                  flex: "0 0 40px",
                }}
              >
                M
              </div>
            )}

            {/* Texto "MyBook" — sólo visible cuando expanded === true. Lo centramos verticalmente
                y usamos la misma familia de color/estilo para que parezca parte del logo. */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                paddingLeft: 0,
                paddingRight: 4,
                whiteSpace: "nowrap",
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
                opacity: expanded ? 1 : 0,
                transition: "opacity 220ms ease",
                pointerEvents: "none", // para que todo el clic/hover esté en el círculo principal
              }}
            >
              MyBook
            </div>
          </div>

          {/* LIBRO ANIMADO — aparece al activarse el logo (showBook true). Está fuera del contenedor del logo,
              pero dentro de la barra, para que no interfiera con la estructura del contenido ni de la sidebar. */}
          {showBook && (
            <div
              ref={bookRef}
              onMouseEnter={handleBookMouseEnter}
              style={{
                position: "absolute",
                left: bookPos.left,
                top: bookPos.top,
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "left 420ms cubic-bezier(.2,.9,.2,1), top 420ms cubic-bezier(.2,.9,.2,1)",
                zIndex: 1500,
                // apariencia flotante + brillo
                filter: "drop-shadow(0 6px 18px rgba(63,140,255,0.25))",
                transform: "translateZ(0)",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
                alt="Libro animado"
                style={{
                  width: "100%",
                  height: "100%",
                  pointerEvents: "auto",
                  cursor: "pointer",
                  // Le damos una ligera animación de flotación en Y además del escape
                  animation: "floatBook 1.6s ease-in-out infinite",
                }}
              />
            </div>
          )}

        </div>

        <div></div>

        {/* 🔹 Derecha (sin cambios estructurales) */}
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

      {/* Animación keyframes inyectada en el componente para evitar tocar el CSS global */}
      <style>
        {`@keyframes floatBook {
            0% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0); }
        }
        `}
      </style>

      {/* 🔹 Contenido principal (mantenido como estaba) */}
      <div style={{ marginTop: "80px" }}>

        {/* 🔹 BARRA LATERAL */}
        <div
          ref={sidebarRef}
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

        {/* 🧱 CONTENIDO CENTRAL */}
        <div
          className="main-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            textAlign: "center",
            marginLeft: "240px", // mantengo exactamente como estaba
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

          {/* Redes sociales */}
          <div className="social-footer">
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