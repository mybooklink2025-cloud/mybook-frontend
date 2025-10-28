import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./Chat.css";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [usuariosActivos, setUsuariosActivos] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [notificaciones, setNotificaciones] = useState({});
  const chatEndRef = useRef(null);

  const emailUsuario = localStorage.getItem("email");

  // 🔹 Conectar socket al backend
  useEffect(() => {
    const newSocket = io("https://mybook-backend.onrender.com", {
      withCredentials: true,
    });
    setSocket(newSocket);

    if (emailUsuario) {
      newSocket.emit("usuarioConectado", emailUsuario);
    }

    // Escucha lista de usuarios activos
    newSocket.on("usuariosActivos", (usuarios) => {
      setUsuariosActivos(usuarios.filter((u) => u.name !== emailUsuario));
    });

    // Escucha mensajes recibidos
    newSocket.on("recibirMensaje", (data) => {
      if (data.remitente === usuarioSeleccionado) {
        setMensajes((prev) => [...prev, data]);
      } else {
        setNotificaciones((prev) => ({
          ...prev,
          [data.remitente]: (prev[data.remitente] || 0) + 1,
        }));
      }
    });

    return () => newSocket.disconnect();
  }, [emailUsuario, usuarioSeleccionado]);

  // 🔹 Scroll automático al final del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  // 🔹 Enviar mensaje
  const enviarMensaje = () => {
    if (mensaje.trim() && usuarioSeleccionado && socket) {
      const data = {
        remitente: emailUsuario,
        receptor: usuarioSeleccionado,
        texto: mensaje,
      };
      socket.emit("enviarMensaje", data);
      setMensajes((prev) => [...prev, data]);
      setMensaje("");
    }
  };

  // 🔹 Seleccionar usuario para chatear
  const seleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMensajes([]);
    setNotificaciones((prev) => ({ ...prev, [usuario]: 0 }));
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h3>Usuarios Activos</h3>
        <ul>
          {usuariosActivos.length === 0 && <p>No hay usuarios conectados 😢</p>}
          {usuariosActivos.map((u) => (
            <li
              key={u.id}
              className={usuarioSeleccionado === u.name ? "active" : ""}
              onClick={() => seleccionarUsuario(u.name)}
            >
              {u.name}
              {notificaciones[u.name] > 0 && (
                <span className="notif-badge">{notificaciones[u.name]}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-box">
        {usuarioSeleccionado ? (
          <>
            <div className="chat-header">
              <h4>Chat con {usuarioSeleccionado}</h4>
            </div>
            <div className="chat-messages">
              {mensajes.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.remitente === emailUsuario
                      ? "mensaje propio"
                      : "mensaje recibido"
                  }
                >
                  <p>{m.texto}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
              />
              <button onClick={enviarMensaje}>Enviar</button>
            </div>
          </>
        ) : (
          <div className="no-chat">
            <p>Selecciona un usuario para comenzar a chatear 💬</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
