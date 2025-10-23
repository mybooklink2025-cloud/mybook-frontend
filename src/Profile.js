import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile({ token }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const decoded = parseJwt(token);
    if (decoded.email) {
      setEmail(decoded.email);
      setUsername(decoded.email.split("@")[0]); // nombre de usuario simple
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

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: postContent }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => [data, ...prev]);
        setPostContent("");
      } else {
        alert(data.message || "Error al publicar");
      }
    } catch {
      alert("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="profile-container">
      <h1>
        <span
          className="logo"
          onClick={() => navigate(token ? "/muro" : "/")}
        >
          MyBook
        </span>
      </h1>

      <h2>Perfil de usuario</h2>

      {profilePicture && (
        <div>
          <img
            src={`${BASE_URL}/uploads/${profilePicture}`}
            alt="Perfil"
            className="profile-picture"
          />
        </div>
      )}

      <form onSubmit={handleUpload} style={{ marginTop: "10px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} /><br />
        <button type="submit">Subir foto</button>
      </form>
      <p style={{ color: "blue" }}>{message}</p>

      <div className="profile-buttons">
        <button onClick={() => navigate("/chat")}>Ir al Chat</button>
        <button onClick={handleCerrarSesion}>Cerrar sesión</button>
      </div>

      {/* Caja de publicación central */}
      <div className="post-form">
        <textarea
          placeholder="Escribe tu publicación..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          rows={4}
        />
        <button onClick={handlePost}>Publicar</button>
      </div>

      {/* Posts del usuario */}
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <div className="post-header">
              {profilePicture && (
                <img src={`${BASE_URL}/uploads/${profilePicture}`} className="post-avatar" alt="Avatar" />
              )}
              <span className="post-author">{username}</span>
            </div>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      <div className="contact-footer">
        <a href="/contactanos">Contáctanos</a>
      </div>

      <div className="redes-footer">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>
        <a href="https://wa.me/573024502105" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    </div>
  );
}

export default Profile;
