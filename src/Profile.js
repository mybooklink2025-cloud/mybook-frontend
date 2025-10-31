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
  const menuRef = useRef(null);

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
    <div className="profile-container">
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
        {/* Izquierda: M + buscador */}
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

        {/* Centro: enlaces */}
        <div style={{ display: "flex", gap: "20px" }}>
          <a
            href="/profile"
            style={{ color: "#0d47a1", textDecoration: "none", fontWeight: "bold" }}
          >
            Perfil
          </a>
          <a
            href="/contactanos"
            style={{ color: "#0d47a1", textDecoration: "none", fontWeight: "bold" }}
          >
            Contáctanos
          </a>
          <span
            onClick={() => navigate("/chat")}
            style={{
              color: "#0d47a1",
              textDecoration: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Chat
          </span>
        </div>

        {/* Derecha: contactos + rueda + chat */}
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
                    src={
                      profilePicture
                        ? `${BASE_URL}/uploads/${profilePicture}`
                        : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt="Usuario"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                  <p style={{ fontSize: "14px", color: "#555" }}>
                    {email || "usuario@mybook.com"}
                  </p>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Tu cuenta</li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Configuración</li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Ayuda</li>
                  <li
                    onClick={handleCerrarSesion}
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
            style={{
              fontSize: "22px",
              cursor: "pointer",
              color: "#0d47a1",
            }}
          >
            💬
          </span>
        </div>
      </div>

      {/* 🔹 Contenido original del perfil (dentro de un contenedor desplazado) */}
      <div style={{ paddingTop: "100px" }}>
        <div className="profile-top-left">
          <h1>
            <span onClick={logoClick} className="profile-logo">
              MyBook
            </span>
          </h1>
          <h2>Perfil de usuario</h2>

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

          <div style={{ marginTop: "20px" }}>
            <button onClick={() => navigate("/chat")} className="btn-green">
              Ir al Chat
            </button>
            <button onClick={handleCerrarSesion} className="btn-red">
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Caja de post centrada */}
        <div className="post-container">
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

        {/* Zona inferior central */}
        <div className="profile-bottom">
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

          <div className="social-links">
            <h3>Síguenos en redes sociales</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                📘 Facebook
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                📸 Instagram
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                🎵 TikTok
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
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
