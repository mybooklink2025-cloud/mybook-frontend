import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function Chat() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}"); // 👈 Guarda tu usuario en el login
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [socket, setSocket] = useState(null);

  // 🔹 Usar el nombre o correo real del usuario logueado
  const nombreUsuario = userData?.nombre || userData?.email || "Invitado";

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    // 🔹 Conectarse al backend de Render
    const newSocket = io("https://mybook-7a9s.onrender.com", {
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(newSocket);

    // Enviar nombre al conectarse
    newSocket.emit("usuarioConectado", nombreUsuario);

    // Escuchar usuarios activos
    newSocket.on("usuariosActivos", (lista) => {
      setUsuarios(lista);
    });

    // Escuchar mensajes
    newSocket.on("recibirMensaje", (data) => {
      setMensajes((prev) => [...prev, data]);
    });

    // Limpieza
    return () => {
      newSocket.disconnect();
    };
  }, [token, nombreUsuario, navigate]);

  const logoClick = () => navigate("/muro");

  const handleEnviar = () => {
    if (!mensaje.trim() || !socket) return;

    const data = {
      autor: nombreUsuario,
      texto: mensaje,
    };

    setMensajes((prev) => [...prev, data]);
    socket.emit("enviarMensaje", data);
    setMensaje("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Logo MyBook azul */}
      <h1>
        <span
          onClick={logoClick}
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "none",
            fontSize: "36px",
          }}
        >
          MyBook
        </span>
      </h1>

      <h2>💬 Chat en tiempo real</h2>

      {/* Usuarios conectados */}
      <div
        style={{
          width: "60%",
          margin: "10px auto",
          backgroundColor: "#f0f8ff",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <h3>🟢 Usuarios conectados:</h3>
        {usuarios.length === 0 ? (
          <p style={{ color: "#999" }}>Nadie conectado aún...</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {usuarios.map((u) => (
              <li
                key={u.id}
                style={{
                  color: u.name === nombreUsuario ? "gray" : "green",
                  fontWeight: u.name === nombreUsuario ? "normal" : "bold",
                }}
              >
                {u.name === nombreUsuario ? `${u.name} (tú)` : u.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mensajes */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          height: "300px",
          width: "60%",
          margin: "20px auto",
          overflowY: "auto",
          textAlign: "left",
          backgroundColor: "#f9f9f9",
        }}
      >
        {mensajes.length === 0 && (
          <p style={{ color: "#999" }}>No hay mensajes aún...</p>
        )}
        {mensajes.map((msg, index) => (
          <p key={index}>
            <strong
              style={{
                color: msg.autor === nombreUsuario ? "gray" : "blue",
              }}
            >
              {msg.autor}:
            </strong>{" "}
            {msg.texto}
          </p>
        ))}
      </div>

      {/* Envío */}
      <input
        type="text"
        value={mensaje}
        placeholder="Escribe un mensaje..."
        onChange={(e) => setMensaje(e.target.value)}
        style={{ width: "60%", padding: "8px" }}
      />
      <button
        onClick={handleEnviar}
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Enviar
      </button>
    </div>
  );
}

export default Chat;
