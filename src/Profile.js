import React, { useState, useEffect } from "react";
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
    const newPost = { autor: email.split("@")[0], texto: postText, foto: profilePicture };
    setPosts((prev) => [newPost, ...prev]);
    setPostText("");
  };

  return (
    <div className="profile-container">
      {/* Zona superior izquierda */}
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
                {p.foto && <img src={`${BASE_URL}/uploads/${p.foto}`} alt="avatar" className="post-avatar" />}
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
          <a href="/contactanos" style={{ color: "blue", fontWeight: "bold", textDecoration: "underline" }}>
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
  );
}

export default Profile;
