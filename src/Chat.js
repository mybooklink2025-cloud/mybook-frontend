import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function Chat() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [socket, setSocket] = useState(null);

  const nombreUsuario = localStorage.getItem("nombre") || "Usuario";

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    // 🔹 Conectar al servidor Socket.IO (Render backend)
    const newSocket = io("https://mybook-backend.onrender.com", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    // 🔹 Notificar al servidor el usuario conectado
    newSocket.emit("usuarioConectado", nombreUsuario);

    // 🔹 Escuchar usuarios activos
    newSocket.on("usuariosActivos", (lista) => {
      setUsuarios(lista);
    });

    // 🔹 Escuchar mensajes entrantes
    newSocket.on("recibirMensaje", (data) => {
      setMensajes((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token, navigate, nombreUsuario]);

  const logoClick = () => {
    if (token) {
      navigate("/muro");
    } else {
      navigate("/");
    }
  };

  const handleEnviar = () => {
    if (!mensaje.trim() || !socket) return;
    const data = {
      autor: nombreUsuario,
      texto: mensaje,
    };
    socket.emit("enviarMensaje", data);
    setMensajes((prev) => [...prev, data]);
    setMensaje("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* 🔹 Logo MyBook azul centrado (NO TOCAR) */}
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

      {/* 🔹 Lista de usuarios conectados */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          width: "60%",
          margin: "10px auto",
          backgroundColor: "#f0f8ff",
        }}
      >
        <h3>Usuarios conectados</h3>
        {usuarios.length === 0 ? (
          <p style={{ color: "#777" }}>Nadie conectado</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {usuarios.map((u) => (
              <li key={u.id} style={{ color: "blue", fontWeight: "bold" }}>
                {u.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔹 Ventana de mensajes */}
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
            <strong style={{ color: "blue" }}>{msg.autor}: </strong> {msg.texto}
          </p>
        ))}
      </div>

      {/* 🔹 Caja de texto y botón */}
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
