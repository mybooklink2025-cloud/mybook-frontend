import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Muro() {
  const navigate = useNavigate();

  // Publicaciones iniciales
  const [publicaciones, setPublicaciones] = useState([
    { id: 1, autor: "Alejo", texto: "¡Bienvenidos al nuevo muro de MyBook!", foto: "https://cdn-icons-png.flaticon.com/512/194/194938.png" },
    { id: 2, autor: "Martin", texto: "Este es el primer paso hacia la versión real 💙", foto: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png" },
    { id: 3, autor: "MyBook Team", texto: "Próximamente podrás publicar, comentar y reaccionar 🚀", foto: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png" },
  ]);

  const [nuevoPost, setNuevoPost] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("Usuario Actual");
  const [fotoUsuario, setFotoUsuario] = useState("https://cdn-icons-png.flaticon.com/512/847/847969.png");

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

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Logo principal */}
      <h1>
        <span
          onClick={logoClick}
          style={{ color: "blue", textDecoration: "none", cursor: "pointer" }}
        >
          MyBook
        </span>
      </h1>

      <h2>🌎 Muro general</h2>

      {/* Navegación superior */}
      <div style={{ marginBottom: "20px" }}>
        <a
          href="/profile"
          style={{
            color: "blue",
            textDecoration: "underline",
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Perfil
        </a>
        |
        <a
          href="/contactanos"
          style={{
            color: "blue",
            textDecoration: "underline",
            fontWeight: "bold",
            marginLeft: "10px",
          }}
        >
          Contáctanos
        </a>
        |
        <span
          onClick={() => navigate("/chat")}
          style={{
            color: "green",
            textDecoration: "underline",
            fontWeight: "bold",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          Chat
        </span>
      </div>

      {/* Nueva publicación */}
      <form onSubmit={handlePublicar} style={{ marginBottom: "30px" }}>
        <textarea
          value={nuevoPost}
          onChange={(e) => setNuevoPost(e.target.value)}
          placeholder="¿Qué estás pensando?"
          rows={3}
          cols={60}
          style={{
            borderRadius: "10px",
            border: "1px solid #ccc",
            padding: "10px",
            resize: "none",
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Publicar
        </button>
      </form>

      {/* Lista de publicaciones */}
      <div style={{ marginTop: "20px" }}>
        {publicaciones.map((post) => (
          <div
            key={post.id}
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={post.foto}
                alt="foto autor"
                width={40}
                height={40}
                style={{ borderRadius: "50%", marginRight: "10px" }}
              />
              <p style={{ fontWeight: "bold", color: "blue", margin: 0 }}>
                {post.autor}
              </p>
            </div>
            <p style={{ marginTop: "10px" }}>{post.texto}</p>
          </div>
        ))}
      </div>

      {/* Redes sociales al pie */}
      <div style={{ marginTop: "50px" }}>
        <h3>Síguenos en redes sociales</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "25px",
            marginTop: "15px",
          }}
        >
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "blue", fontWeight: "bold" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="Facebook"
              width={24}
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "purple",
              fontWeight: "bold",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
              alt="Instagram"
              width={24}
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
            Instagram
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "black",
              fontWeight: "bold",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png"
              alt="TikTok"
              width={24}
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
            TikTok
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "black",
              fontWeight: "bold",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
              alt="Twitter"
              width={24}
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
            X (Twitter)
          </a>
          <a
            href="https://wa.me/573024502105"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "green",
              fontWeight: "bold",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
              alt="WhatsApp"
              width={24}
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
            WhatsApp (3024502105)
          </a>
        </div>
      </div>
    </div>
  );
}

export default Muro;