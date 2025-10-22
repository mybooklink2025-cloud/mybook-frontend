import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile({ token }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  // Decodifica el token para extraer el correo y nombre
  useEffect(() => {
    const decoded = parseJwt(token);
    if (decoded.email) {
      setEmail(decoded.email);
      setNombre(decoded.email.split("@")[0]); // nombre visible
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

  const handlePost = (e) => {
    e.preventDefault();
    if (post.trim() === "") return;
    const nuevoPost = {
      id: Date.now(),
      autor: nombre,
      foto: profilePicture ? `${BASE_URL}/uploads/${profilePicture}` : "",
      texto: post,
    };
    setPosts([nuevoPost, ...posts]);
    setPost("");
  };

  const logoClick = () => {
    const tokenStored = localStorage.getItem("token");
    navigate(tokenStored ? "/muro" : "/");
  };

  return (
    <div className="profile-container">
      <h1>
        <span className="profile-logo" onClick={logoClick}>
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
            className="profile-picture"
          />
        </div>
      )}

      {/* Subir foto */}
      <form onSubmit={handleUpload} style={{ marginTop: "10px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button type="submit">Subir foto</button>
      </form>

      <p className="profile-message">{message}</p>

      {/* Caja de publicación */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <h3>📝 Crear publicación</h3>
        <form onSubmit={handlePost}>
          <textarea
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="¿Qué estás pensando?"
            rows={4}
            cols={50}
            required
            style={{ borderRadius: "10px", padding: "10px", border: "1px solid #ccc" }}
          />
          <br />
          <button
            type="submit"
            style={{
              marginTop: "10px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Publicar
          </button>
        </form>

        {/* Lista de publicaciones */}
        <div style={{ marginTop: "30px" }}>
          {posts.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                margin: "10px auto",
                width: "60%",
                textAlign: "left",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {p.foto && (
                  <img
                    src={p.foto}
                    alt="Autor"
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                )}
                <strong style={{ color: "blue" }}>{p.autor}</strong>
              </div>
              <p style={{ marginTop: "10px" }}>{p.texto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Botones principales */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/chat")}
          className="profile-button green"
        >
          Ir al Chat
        </button>
        <button onClick={handleCerrarSesion} className="profile-button red">
          Cerrar sesión
        </button>
      </div>

      {/* Enlace “Contáctanos” */}
      <div className="contact-link">
        <a href="/contactanos">Contáctanos</a>
      </div>

      {/* Redes sociales */}
      <div className="social-section">
        <h3>Síguenos en redes sociales</h3>
        <div className="social-links">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="20" alt="Facebook" />
            Facebook
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" alt="Instagram" />
            Instagram
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046120.png" width="20" alt="TikTok" />
            TikTok
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="20" alt="X" />
            X (Twitter)
          </a>
          <a
            href="https://wa.me/573024502105"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
              width="20"
              alt="WhatsApp"
            />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default Profile;
