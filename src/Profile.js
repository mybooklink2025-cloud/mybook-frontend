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

  const handlePost = (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    const newPost = {
      id: Date.now(),
      autor: email.split("@")[0],
      texto: postContent,
      avatar: profilePicture ? `${BASE_URL}/uploads/${profilePicture}` : null,
    };
    setPosts([newPost, ...posts]);
    setPostContent("");
  };

  return (
    <div className="profile-page">

      {/* Zona superior izquierda */}
      <div className="profile-top-left">
        <h1>
          <span onClick={logoClick} className="profile-logo">MyBook</span>
        </h1>
        <h2>Perfil de usuario</h2>

        <form onSubmit={handleUpload} style={{ marginTop: "10px" }}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <br />
          <button type="submit">Subir foto</button>
        </form>

        {profilePicture && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={`${BASE_URL}/uploads/${profilePicture}`}
              alt="Perfil"
              width={150}
              style={{ borderRadius: "50%" }}
            />
          </div>
        )}
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

      {/* Zona central: cuadro de post y publicaciones */}
      <div className="profile-center-post">
        <form className="post-form" onSubmit={handlePost}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Escribe tu publicación..."
          />
          <button type="submit">Publicar</button>
        </form>

        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                {post.avatar && <img src={post.avatar} alt="Avatar" className="post-avatar" />}
                <span className="post-author">{post.autor}</span>
              </div>
              <p>{post.texto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Zona inferior-central: Contáctanos y redes */}
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
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">📘 Facebook</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">📸 Instagram</a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">🎵 TikTok</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">🐦 X (Twitter)</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
