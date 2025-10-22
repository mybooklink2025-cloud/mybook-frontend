import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Muro.css"; // ✅ Importa los estilos sin alterar nada más

function Muro() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [publicaciones, setPublicaciones] = useState([
    { id: 1, autor: "Alejo", foto: "/default-avatar.png", texto: "¡Bienvenidos al nuevo muro de MyBook!" },
    { id: 2, autor: "Martin", foto: "/default-avatar.png", texto: "Este es el primer paso hacia la versión real 💙" },
    { id: 3, autor: "MyBook Team", foto: "/default-avatar.png", texto: "Próximamente podrás publicar, comentar y reaccionar 🚀" },
  ]);

  const [nuevoPost, setNuevoPost] = useState("");
  const [usuario, setUsuario] = useState({ nombre: "", foto: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const email = decoded.email || "Usuario";
      const savedPic = localStorage.getItem(`profilePicture_${email}`);
      setUsuario({
        nombre: email.split("@")[0],
        foto: savedPic ? `${BASE_URL}/uploads/${savedPic}` : "/default-avatar.png",
      });
    } catch (err) {
      console.error("Error al decodificar token:", err);
    }
  }, [BASE_URL]);

  const publicar = (e) => {
    e.preventDefault();
    if (!nuevoPost.trim()) return;

    const nuevaPublicacion = {
      id: publicaciones.length + 1,
      autor: usuario.nombre || "Usuario actual",
      foto: usuario.foto || "/default-avatar.png",
      texto: nuevoPost,
    };

    setPublicaciones([nuevaPublicacion, ...publicaciones]);
    setNuevoPost("");
  };

  const redes = [
    { nombre: "Facebook", url: "https://facebook.com", icono: "https://cdn-icons-png.flaticon.com/512/733/733547.png" },
    { nombre: "Instagram", url: "https://instagram.com", icono: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png" },
    { nombre: "X (Twitter)", url: "https://x.com", icono: "https://cdn-icons-png.flaticon.com/512/733/733579.png" },
    { nombre: "TikTok", url: "https://www.tiktok.com", icono: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png" },
    { nombre: "WhatsApp", url: "https://wa.me/573024502105", icono: "https://cdn-icons-png.flaticon.com/512/733/733585.png" },
  ];

  const logoClick = () => navigate("/muro");

  return (
    <div className="muro-container">
      <h1 className="muro-logo" onClick={logoClick}>MyBook</h1>
      <h2 className="muro-subtitulo">🌎 Muro general</h2>

      <div className="muro-nav">
        <a href="/profile">Perfil</a> | <a href="/contactanos">Contáctanos</a> |{" "}
        <span onClick={() => navigate("/chat")}>Chat</span>
      </div>

      {/* Formulario de publicación */}
      <form className="post-form" onSubmit={publicar}>
        <textarea
          placeholder="¿Qué estás pensando?"
          value={nuevoPost}
          onChange={(e) => setNuevoPost(e.target.value)}
          rows="3"
        />
        <br />
        <button type="submit">Publicar</button>
      </form>

      {/* Publicaciones */}
      {publicaciones.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <img src={post.foto} alt="Usuario" />
            <p className="post-author">{post.autor}</p>
          </div>
          <p>{post.texto}</p>
        </div>
      ))}

      {/* Redes sociales */}
      <div className="redes-container">
        <h3>Síguenos en redes sociales</h3>
        <div className="redes-links">
          {redes.map((r) => (
            <a key={r.nombre} href={r.url} target="_blank" rel="noopener noreferrer">
              <img src={r.icono} alt={r.nombre} /> {r.nombre}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Muro;
