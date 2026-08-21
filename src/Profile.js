import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile({ token }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [bookPos, setBookPos] = useState({ left: 0, top: 0 });

  const menuRef = useRef(null);

  // 👉 NUEVOS ESTADOS para la barra lateral
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);

  const topBarRef = useRef(null);
  const logoRef = useRef(null);
  const bookRef = useRef(null);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const decoded = parseJwt(token);
    if (decoded.email) {
      setEmail(decoded.email);
      const savedPicture = localStorage.getItem(`profilePicture_${decoded.email}`);
      if (savedPicture) setProfilePicture(savedPicture);
    }
  }, [token]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Selecciona un archivo");

    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("email", email);

    try {
      const res = await fetch(`${BASE_URL}/auth/upload-profile-picture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Foto subida correctamente");
        setProfilePicture(data.filename);
        localStorage.setItem(`profilePicture_${email}`, data.filename);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch {
      setMessage("❌ Error al conectar con el servidor");
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return {};
    }
  };

  const logoClick = () => {
    const tokenStored = localStorage.getItem("token");
    navigate(tokenStored ? "/muro" : "/");
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handlePost = () => {
    if (!postText.trim()) return;
    const newPost = {
      autor: email.split("@")[0],
      texto: postText,
      foto: profilePicture,
    };
    setPosts((prev) => [newPost, ...prev]);
    setPostText("");
  };

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
    const left = logoRect.right - barRect.left + 12;
    const top = (barRect.height - 48) / 2;

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

    const minLeft = Math.max(logoRect.right - barRect.left + 8, 8);
    const maxLeft = Math.max(
      barRect.width - bookRect.width - 12,
      minLeft + 12
    );

    const randomLeft =
      Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;

    const top = (barRect.height - bookRect.height) / 2;

    setBookPos({ left: randomLeft, top });
  };

  // Cuando el usuario coloca el cursor sobre el libro, lo hacemos escapar.
  const handleBookMouseEnter = () => {
    escapeBook();
  };

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

  // 🔗 Enlaces fijos de la barra lateral
  const linksFijos = [
    { nombre: "🌐 Google", url: "https://www.google.com" },
    { nombre: "🎬 YouTube", url: "https://www.youtube.com" },
    { nombre: "🎵 Spotify", url: "https://open.spotify.com" },
    { nombre: "📰 Noticias", url: "https://news.google.com" },
    { nombre: "☁️ Clima", url: "https://weather.com" },
    { nombre: "🕹️ Juegos", url: "https://poki.com" },
  ];

  return (
    <div
      className="profile-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "80px",
      }}
    >
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
          overflow: "visible",
        }}
      >
        {/* 🔹 Izquierda: LOGO M + texto extendido */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "left",
          }}
        >
          <div
            ref={logoRef}
            onClick={logoClick}
            onMouseEnter={activateLogo}
            style={{
              display: "flex",
              alignItems: "left",
              justifyContent: "flex-start",
              position: "relative",
              width: expanded ? 140 : 40,
              height: 40,
              transition: "width 280ms ease, border-radius 280ms ease",
              borderRadius: expanded ? 20 : "50%",
              backgroundColor: "#0d47a1",
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                paddingLeft: 4,
                paddingRight: 8,
                whiteSpace: "nowrap",
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
                opacity: expanded ? 1 : 0,
                transition: "opacity 220ms ease",
                pointerEvents: "none",
              }}
            >
              MyBook
            </div>
          </div>

          {/* LIBRO ANIMADO */}
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
                transition:
                  "left 420ms cubic-bezier(.2,.9,.2,1), top 420ms cubic-bezier(.2,.9,.2,1)",
                zIndex: 1500,
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
                  animation: "floatBook 1.6s ease-in-out infinite",
                }}
              />
            </div>
          )}
        </div>

        <div></div>

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
                  <p style={{ fontSize: "14px", color: "#555" }}>
                    {localStorage.getItem("email") || "usuario@mybook.com"}
                  </p>
                </div>

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

                  <li style={{ padding: "8px", cursor: "pointer" }}>
                    Configuración
                  </li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>
                    Ayuda
                  </li>

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
            icon: "https://www.google.com/favicon.ico",
          },
          {
            title: "YouTube",
            url: "https://www.youtube.com",
            icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
          },
          {
            title: "Spotify",
            url: "https://open.spotify.com",
            icon: "https://cdn-icons-png.flaticon.com/512/174/174872.png",
          },
          {
            title: "Noticias",
            url: "https://news.google.com",
            icon: "https://cdn-icons-png.flaticon.com/512/2965/2965879.png",
          },
          {
            title: "Clima",
            url: "https://weather.com",
            icon: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
          },
          {
            title: "Juegos (Poki)",
            url: "https://poki.com/es",
            icon: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
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
              e.currentTarget.style.filter =
                "drop-shadow(0 0 6px white)";
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

      {/* 🔹 CONTENIDO DEL PERFIL */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="profile-top-center" style={{ textAlign: "center" }}>
          <h1>
            <span onClick={logoClick} className="profile-logo">
              MyBook
            </span>
          </h1>
          <h2 style={{ color: "blue" }}>Mi perfil</h2>
        </div>

        {profilePicture && (
          <img
            src={`${BASE_URL}/uploads/${profilePicture}`}
            alt="Perfil"
            width={150}
            style={{ borderRadius: "50%" }}
          />
        )}

        <form onSubmit={handleUpload} style={{ marginTop: "10px" }}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <br />
          <button type="submit">Subir foto</button>
        </form>

        <p style={{ color: "blue" }}>{message}</p>

        <div style={{ marginTop: "10px" }}>
          <button onClick={() => navigate("/chat")} className="btn-green">
            Ir al Chat
          </button>
          <button onClick={handleCerrarSesion} className="btn-green">
            Cerrar sesión
          </button>
        </div>

        {/* Caja de post centrada */}
        <div className="post-container" style={{ marginTop: "30px" }}>
          <textarea
            placeholder="Escribe tu publicación..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
          <button onClick={handlePost}>Publicar</button>

          <div className="posts-list">
            {posts.map((p, index) => (
              <div key={index} className="post">
                <div className="post-header">
                  {p.foto && (
                    <img
                      src={`${BASE_URL}/uploads/${p.foto}`}
                      alt="avatar"
                      className="post-avatar"
                    />
                  )}
                  <span className="post-author">{p.autor}</span>
                </div>
                <p>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Zona inferior */}
        <div className="profile-bottom" style={{ marginTop: "40px" }}>
          <div className="contact-link">
            <a
              href="/contactanos"
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Contáctanos
            </a>
          </div>

          <div className="social-links" style={{ textAlign: "center" }}>
            <h3>Síguenos en redes sociales</h3>
            <div className="social-icons">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                📘 Facebook
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                📸 Instagram
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                🎵 TikTok
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                🐦 X (Twitter)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;