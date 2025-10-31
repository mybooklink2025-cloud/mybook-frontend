import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Muro.css";

function Muro() {
  const navigate = useNavigate();

  const [publicaciones, setPublicaciones] = useState([
    { id: 1, autor: "Alejo", texto: "¡Bienvenidos al nuevo muro de MyBook!", foto: "https://cdn-icons-png.flaticon.com/512/194/194938.png" },
    { id: 2, autor: "Martin", texto: "Este es el primer paso hacia la versión real 💙", foto: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png" },
    { id: 3, autor: "MyBook Team", texto: "Próximamente podrás publicar, comentar y reaccionar 🚀", foto: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png" },
  ]);

  const [nuevoPost, setNuevoPost] = useState("");
  const [nombreUsuario] = useState("Usuario Actual");
  const [fotoUsuario] = useState("https://cdn-icons-png.flaticon.com/512/847/847969.png");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const menuRef = useRef(null);
  const sidebarRef = useRef(null);

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

  const linksFijos = [
    { nombre: "Facebook", url: "https://facebook.com" },
    { nombre: "Instagram", url: "https://instagram.com" },
    { nombre: "TikTok", url: "https://www.tiktok.com" },
    { nombre: "X (Twitter)", url: "https://x.com" },
    { nombre: "Noticias", url: "https://www.bbc.com" },
    { nombre: "Juegos", url: "https://www.miniclip.com" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuVisible(false);
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) setSidebarVisible(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="muro-page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* 🔵 BARRA SUPERIOR */}
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
        {/* Izquierda: logo y buscador */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            onClick={logoClick}
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
          <a href="/profile" style={{ color: "#0d47a1", fontWeight: "bold" }}>
            Perfil
          </a>
          <a href="/contactanos" style={{ color: "#0d47a1", fontWeight: "bold" }}>
            Contáctanos
          </a>
          <span
            onClick={() => navigate("/chat")}
            style={{ color: "#0d47a1", fontWeight: "bold", cursor: "pointer" }}
          >
            Chat
          </span>
        </div>

        {/* Derecha: contactos y menú */}
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

          {/* Menú configuración */}
          <div style={{ position: "relative" }} ref={menuRef}>
            <span
              onClick={() => setMenuVisible(!menuVisible)}
              style={{ fontSize: "22px", cursor: "pointer", color: "#0d47a1" }}
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
                    src={fotoUsuario}
                    alt="Usuario"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                  <p style={{ fontSize: "14px", color: "#555" }}>
                    {localStorage.getItem("email") || "usuario@mybook.com"}
                  </p>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Tu cuenta</li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Configuración</li>
                  <li style={{ padding: "8px", cursor: "pointer" }}>Ayuda</li>
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

      {/* 🔹 Contenido principal */}
      <div
        style={{
          marginTop: "80px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarVisible ? "250px" : "0px", // 🔹 Aquí se mueve el contenido
        }}
      >
        <div style={{ width: "100%", maxWidth: "1000px", position: "relative" }}>
          {/* 🍔 Botón hamburguesa */}
          <div
            style={{
              position: "fixed",
              top: "80px",
              left: sidebarVisible ? "260px" : "10px",
              zIndex: 1100,
              transition: "left 0.3s ease",
            }}
          >
            <div
              onClick={() => setSidebarVisible(!sidebarVisible)}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "3px",
                width: "25px",
                height: "25px",
                backgroundColor: "white",
                borderRadius: "4px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                padding: "3px",
              }}
            >
              <div style={{ width: "22px", height: "2px", backgroundColor: "blue" }}></div>
              <div style={{ width: "22px", height: "2px", backgroundColor: "blue" }}></div>
              <div style={{ width: "22px", height: "2px", backgroundColor: "blue" }}></div>
            </div>
          </div>

          {/* 🔹 Barra lateral */}
          <div
            ref={sidebarRef}
            className="sidebar"
            style={{
              position: "fixed",
              top: "80px",
              left: sidebarVisible ? "0" : "-250px",
              width: "250px",
              height: "100%",
              backgroundColor: "white",
              boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
              transition: "left 0.3s ease",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <h3>Enlaces rápidos</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {linksFijos.map((link) => (
                <li key={link.nombre} style={{ marginBottom: "10px" }}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "none", fontWeight: "bold" }}
                  >
                    {link.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 🧱 Contenido principal */}
          <div
            className="main-content"
            style={{
              margin: "0 auto",
              maxWidth: "700px",
              textAlign: "center",
            }}
          >
            <h1 onClick={logoClick} style={{ color: "blue", cursor: "pointer" }}>
              MyBook
            </h1>
            <h2>🌎 Muro general</h2>

            <form onSubmit={handlePublicar} style={{ marginBottom: "20px" }}>
              <textarea
                value={nuevoPost}
                onChange={(e) => setNuevoPost(e.target.value)}
                placeholder="¿Qué estás pensando?"
                rows={3}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="submit"
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "blue",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Publicar
              </button>
            </form>

            <div>
              {publicaciones.map((post) => (
                <div
                  key={post.id}
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "10px",
                    padding: "10px",
                    marginBottom: "10px",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={post.foto}
                      alt="foto autor"
                      style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                    />
                    <strong>{post.autor}</strong>
                  </div>
                  <p style={{ marginTop: "5px" }}>{post.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Muro;
