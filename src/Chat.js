import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://mybook-7a9s.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

function Chat() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const chatName = localStorage.getItem("chatName") || "Usuario Actual";

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  // Redirigir si no hay token
  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  // Conexión inicial
  useEffect(() => {
    socket.emit("usuarioConectado", chatName);

    socket.on("usuariosActivos", (lista) => {
      setUsuarios(lista.filter((u) => u.name !== chatName)); // excluirme
    });

    socket.on("recibirMensaje", (data) => {
      setMensajes((prev) => [...prev, { ...data, recibido: true }]);
    });

    return () => {
      socket.off("usuariosActivos");
      socket.off("recibirMensaje");
    };
  }, [chatName]);

  const logoClick = () => {
    navigate("/muro");
  };

  const handleEnviar = () => {
    if (!mensaje.trim() || !usuarioSeleccionado) return;

    const nuevoMensaje = {
      autor: chatName,
      receptor: usuarioSeleccionado.name,
      texto: mensaje,
    };

    // Emitir mensaje privado
    socket.emit("enviarMensaje", nuevoMensaje);

    // Mostrarlo en mi chat local
    setMensajes((prev) => [
      ...prev,
      { ...nuevoMensaje, recibido: false },
    ]);

    setMensaje("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* 🌌 Fondo degradado sin polígonos */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at 30% 20%, #0d1b3a 0%, #081326 50%, #01060f 100%)",
        zIndex: -1,
      }}
    ></div>

      {/* LOGO MyBook azul centrado */}
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

      {/* Contenedor principal */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* Lista de usuarios conectados */}
        <div
          style={{
            width: "200px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            backgroundColor: "#f2f2f2",
            textAlign: "left",
            height: "400px",
            overflowY: "auto",
          }}
        >
          <h3>Usuarios conectados</h3>
          {usuarios.length === 0 && (
            <p style={{ color: "#777" }}>No hay otros usuarios aún</p>
          )}
          {usuarios.map((u) => (
            <div
              key={u.id}
              onClick={() => setUsuarioSeleccionado(u)}
              style={{
                padding: "8px",
                marginBottom: "5px",
                borderRadius: "6px",
                cursor: "pointer",
                backgroundColor:
                  usuarioSeleccionado?.id === u.id ? "#007bff" : "#fff",
                color:
                  usuarioSeleccionado?.id === u.id ? "white" : "black",
              }}
            >
              {u.name}
            </div>
          ))}
        </div>

        {/* Ventana de chat */}
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            width: "60%",
            height: "400px",
            overflowY: "auto",
            backgroundColor: "#fafafa",
            textAlign: "left",
          }}
        >
          {usuarioSeleccionado ? (
            <>
              <h3 style={{ textAlign: "center" }}>
                💭 Conversación con{" "}
                <span style={{ color: "blue" }}>
                  {usuarioSeleccionado.name}
                </span>
              </h3>
              {mensajes
                .filter(
                  (m) =>
                    (m.autor === chatName &&
                      m.receptor === usuarioSeleccionado.name) ||
                    (m.autor === usuarioSeleccionado.name &&
                      m.receptor === chatName)
                )
                .map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: msg.recibido
                        ? "flex-start"
                        : "flex-end",
                      margin: "8px 0",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: msg.recibido
                          ? "#e0e0e0"
                          : "#007bff",
                        color: msg.recibido ? "black" : "white",
                        padding: "10px",
                        borderRadius: "12px",
                        maxWidth: "70%",
                      }}
                    >
                      {msg.texto}
                    </div>
                  </div>
                ))}
            </>
          ) : (
            <p style={{ color: "#777", textAlign: "center" }}>
              Selecciona un usuario para comenzar el chat 👆
            </p>
          )}
        </div>
      </div>

      {/* Campo de texto y botón */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={mensaje}
          placeholder="Escribe un mensaje..."
          onChange={(e) => setMensaje(e.target.value)}
          style={{ width: "60%", padding: "8px" }}
          disabled={!usuarioSeleccionado}
        />
        <button
          onClick={handleEnviar}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            cursor: usuarioSeleccionado ? "pointer" : "not-allowed",
            backgroundColor: usuarioSeleccionado ? "blue" : "gray",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
          disabled={!usuarioSeleccionado}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;
