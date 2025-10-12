import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  if (!token) {
    // Redirige a inicio si no hay token
    navigate("/");
    return null;
  }

  const handleEnviar = () => {
    if (!mensaje.trim()) return;
    // Agregamos mensaje al estado local
    setMensajes((prev) => [...prev, { autor: "Yo", texto: mensaje }]);
    setMensaje("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Chat de MyBook</h1>

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
        {mensajes.length === 0 && <p style={{ color: "#999" }}>No hay mensajes aún...</p>}
        {mensajes.map((msg, index) => (
          <p key={index}>
            <strong style={{ color: "blue" }}>{msg.autor}: </strong>
            {msg.texto}
          </p>
        ))}
      </div>

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
