import React, { useState, useRef, useEffect } from "react";
import { enviarContacto } from "./api";
import { useNavigate } from "react-router-dom";

function Contactanos() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [bookPos, setBookPos] = useState({ left: 0, top: 0 });

  const menuRef = useRef(null);
  const topBarRef = useRef(null);
  const logoRef = useRef(null);
  const bookRef = useRef(null);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userEmail = decoded.email || decoded.sub || "";

      if (userEmail) {
        const savedPicture = localStorage.getItem(
          `profilePicture_${userEmail}`
        );

        if (savedPicture) {
          setProfilePicture(savedPicture);
        }
      }
    } catch (error) {
      console.error("Error leyendo token:", error);
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const activateLogo = () => {
    if (!topBarRef.current || !logoRef.current) {
      setExpanded(true);
      setShowBook(true);
      return;
    }

    const barRect = topBarRef.current.getBoundingClientRect();
    const logoRect = logoRef.current.getBoundingClientRect();

    const left = logoRect.right - barRect.left + 12;
    const top = (barRect.height - 48) / 2;

    setExpanded(true);
    setShowBook(true);
    setBookPos({ left, top });
  };

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

  const handleBookMouseEnter = () => {
    escapeBook();
  };

  const getStoredEmail = () => {
    if (!token) return localStorage.getItem("email") || "";

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return (
        decoded.email ||
        decoded.sub ||
        localStorage.getItem("email") ||
        ""
      );
    } catch {
      return localStorage.getItem("email") || "";
    }
  };

  const currentEmail =
    getStoredEmail() || "usuario@mybook.com";

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
        {/* 🔹 Izquierda: LOGO M + texto extendido + libro animado */}
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
                filter:
                  "drop-shadow(0 6px 18px rgba(63,140,255,0.25))",
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
                  {profilePicture && (
                    <img
                      src={`${BASE_URL}/uploads/${profilePicture}`}
                      alt="Usuario"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        display: "block",
                        margin: "0 auto 8px",
                      }}
                    />
                  )}

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      margin: 0,
                    }}
                  >
                    {currentEmail}
                  </p>
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <li
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/profile")}
                  >
                    Perfil
                  </li>

                  <li
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/contactanos")}
                  >
                    Contáctanos
                  </li>

                  <li
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/chat")}
                  >
                    Chat
                  </li>

                  <li
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Configuración
                  </li>

                  <li
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                    }}
                  >
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

      <style>
        {`@keyframes floatBook {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }`}
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
        style={{
          display: "inline-block",
          textAlign: "left",
          color: "white",
        }}
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
          style={{
            color: "lightblue",
            textDecoration: "underline",
          }}
        >
          Escríbenos por WhatsApp 📱
        </a>
      </p>
    </div>
  );
}

export default Contactanos;