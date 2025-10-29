import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function Chat() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [socket, setSocket] = useState(null);
  const [usuario, setUsuario] = useState(localStorage.getItem("email") || "Usuario");
  const [usuariosActivos, setUsuariosActivos] = useState([]);
  const [receptor, setReceptor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  // Redirigir si no hay token
  if (!token) {
    navigate("/");
    return null;
  }

  // Logo MyBook (no se toca)
  const logoClick = () => {
    navigate("/muro");
  };

  // Conectar al servidor Socket.IO
  useEffect(() => {
    const newSocket = io("https://mybook-backend.onrender.com", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    setSocket(newSocket);

    // Emitir evento de conexión del usuario
    newSocket.emit("usuarioConectado", usuario);

    // Escuchar lista de usuarios activos
    newSocket.on("usuariosActivos", (lista) => {
      setUsuariosActivos(lista);
    });

    // Escuchar mensajes entrantes
    newSocket.on("recibirMensaje", (data) => {
      setMensajes((prev) => [...prev, { autor: data.emisor, texto: data.mensaje }]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [usuario]);

  // Enviar mensaje
  const handleEnviar = () => {
    if (!mensaje.trim() || !receptor) return;

    const data = { emisor: usuario, receptor, mensaje };
    socket.emit("enviarMensaje", data);

    setMensajes((prev) => [...prev, { autor: "Yo", texto: mensaje }]);
    setMensaje("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* 🔹 Logo MyBook azul centrado (no se toca) */}
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

      <h2>Chat de MyBook</h2>

      {/* 🔹 Lista de usuarios conectados */}
      <div
        style={{
          margin: "10px auto",
          border: "1px solid #ccc",
          borderRadius: "10px",
          width: "60%",
          padding: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <h3>Usuarios conectados:</h3>
        {usuariosActivos.length === 0 && <p>No hay usuarios en línea...</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {usuariosActivos.map((u) => (
            <li
              key={u.id}
              onClick={() => setReceptor(u.name)}
              style={{
                cursor: "pointer",
                fontWeight: receptor === u.name ? "bold" : "normal",
                color: receptor === u.name ? "green" : "black",
              }}
            >
              {u.name}
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

      {/* 🔹 Campo para escribir y enviar */}
      <input
        type="text"
        value={mensaje}
        placeholder={
          receptor
            ? `Escribe un mensaje para ${receptor}...`
            : "Selecciona un usuario para chatear..."
        }
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
