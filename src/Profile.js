import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile({ token }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);

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

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    setPosts((prev) => [
      { autor: email, avatar: profilePicture, contenido: postContent },
      ...prev,
    ]);
    setPostContent("");
  };

  return (
    <div className="profile-container">
      {/* Logo en esquina superior izquierda */}
      <h1>
        <span onClick={logoClick} className="profile-logo">
          MyBook
        </span>
      </h1>

      <h2>Perfil de usuario</h2>

      {/* Foto de perfil */}
      {profilePicture && (
        <div>
          <img
            src={`${BASE_URL}/uploads/${profilePicture}`}
            alt="Perfil"
            width={150}
            style={{ borderRadius: "50%" }}
          />
        </div>
      )}

      {/* Formulario para subir foto */}
      <form onSubmit={handleUpload} style={{ marginTop: "10px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button type="submit">Subir foto</button>
      </form>
      <p style={{ color: "blue" }}>{message}</p>

      {/* Caja de publicación (al centro, entre foto y botones) */}
      <form className="post-form" onSubmit={handlePostSubmit}>
        <textarea
          placeholder="Escribe un post..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <button type="submit">Publicar</button>
      </form>

      {/* Botones de chat y cerrar sesión */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/chat")} className="btn-green">
          Ir al Chat
        </button>
        <button onClick={handleCerrarSesion} className="btn-red">
          Cerrar sesión
        </button>
      </div>

      {/* Contáctanos con hipervínculo */}
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

      {/* Redes sociales más abajo */}
      <div className="social-links">
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
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            🐦 X (Twitter)
          </a>
        </div>
      </div>

      {/* Posts publicados */}
      <div className="posts-list">
        {posts.map((post, idx) => (
          <div className="post" key={idx}>
            <div className="post-header">
              {post.avatar && (
                <img
                  src={`${BASE_URL}/uploads/${post.avatar}`}
                  alt="avatar"
                  className="post-avatar"
                />
              )}
              <span className="post-author">{post.autor}</span>
            </div>
            <p>{post.contenido}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
