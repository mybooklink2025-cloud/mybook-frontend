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

  // 🟢 Nombre de usuario temporal guardado en localStorage
  const storedName = localStorage.getItem("chatName");
  const [nombreUsuario, setNombreUsuario] = useState(
    storedName || `Usuario-${Math.floor(Math.random() * 1000)}`
  );

  useEffect(() => {
    if (!storedName) {
      const nombreTemp = prompt("Ingresa tu nombre para el chat:");
      if (nombreTemp) {
        localStorage.setItem("chatName", nombreTemp);
        setNombreUsuario(nombreTemp);
      }
    }
  }, [storedName]);

  // 🚀 Conectar con el servidor de Render
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const newSocket = io("https://mybook-7a9s.onrender.com", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.emit("usuarioConectado", nombreUsuario);

    newSocket.on("usuariosActivos", (lista) => {
      setUsuarios(lista);
    });

    newSocket.on("recibirMensaje", (data) => {
      setMensajes((prev) => [...prev, data]);
    });

    return () => newSocket.disconnect();
  }, [navigate, token, nombreUsuario]);

  const logoClick = () => {
    if (token) navigate("/muro");
    else navigate("/");
  };

  const handleEnviar = () => {
    if (!mensaje.trim() || !socket) return;

    const data = {
      autor: nombreUsuario,
      texto: mensaje,
      receptor: null, // 🔹 Por ahora todos reciben el mensaje
    };

    socket.emit("enviarMensaje", data);
    setMensajes((prev) => [...prev, { autor: "Tú", texto: mensaje }]);
    setMensaje("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* 🔹 Logo MyBook azul centrado */}
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
          width: "60%",
          margin: "10px auto",
          padding: "10px",
          backgroundColor: "#eef",
        }}
      >
        <strong>🟢 Usuarios conectados:</strong>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {usuarios.map((u) => (
            <li key={u.id}>
              {u.name === nombreUsuario ? `${u.name} (tú)` : u.name}
            </li>
          ))}
        </ul>
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

      {/* 🔹 Campo de mensaje */}
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
