import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Chat.css"; // Opcional, por si quieres agregar estilos aparte

// 🔹 URL de tu backend en Render:
const socket = io("https://mybook-backend.onrender.com", {
  transports: ["websocket"],
});

export default function Chat() {
  const [usuarios, setUsuarios] = useState([]);
  const [receptor, setReceptor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState("");

  useEffect(() => {
    // 1️⃣ Tomar el email del usuario logueado
    const email = localStorage.getItem("userEmail");
    setUsuarioActual(email);

    // 2️⃣ Avisar al servidor que este usuario se conectó
    if (email) socket.emit("usuarioConectado", email);

    // 3️⃣ Escuchar la lista actualizada de usuarios conectados
    socket.on("usuariosActivos", (lista) => {
      setUsuarios(lista.filter((u) => u.name !== email));
    });

    // 4️⃣ Escuchar mensajes recibidos
    socket.on("recibirMensaje", (data) => {
      setMensajes((prev) => [...prev, { ...data, tipo: "recibido" }]);
    });

    // 5️⃣ Limpiar eventos al salir
    return () => {
      socket.off("usuariosActivos");
      socket.off("recibirMensaje");
    };
  }, []);

  // Enviar mensaje al receptor
  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!receptor || !mensaje.trim()) return;

    const data = {
      emisor: usuarioActual,
      receptor,
      mensaje,
    };

    // Emitir al servidor
    socket.emit("enviarMensaje", data);

    // Mostrar en pantalla también el mensaje propio
    setMensajes((prev) => [...prev, { ...data, tipo: "enviado" }]);
    setMensaje("");
  

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

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3>Usuarios Conectados</h3>
        {usuarios.length === 0 && <p>No hay otros usuarios conectados</p>}
        {usuarios.map((u) => (
          <div
            key={u.id}
            style={{
              ...styles.userItem,
              backgroundColor: receptor === u.name ? "#007bff" : "#eee",
              color: receptor === u.name ? "white" : "black",
            }}
            onClick={() => setReceptor(u.name)}
          >
            {u.name}
          </div>
        ))}
      </div>

      <div style={styles.chatBox}>
        <h3>Chat con: {receptor || "Selecciona un usuario"}</h3>
        <div style={styles.messagesContainer}>
          {mensajes
            .filter(
              (m) =>
                (m.emisor === usuarioActual && m.receptor === receptor) ||
                (m.emisor === receptor && m.receptor === usuarioActual)
            )
            .map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf:
                    m.tipo === "enviado" ? "flex-end" : "flex-start",
                  backgroundColor:
                    m.tipo === "enviado" ? "#007bff" : "#ccc",
                  color: "white",
                }}
              >
                {m.mensaje}
              </div>
            ))}
        </div>

        {receptor && (
          <form style={styles.form} onSubmit={enviarMensaje}>
            <input
              type="text"
              value={mensaje}
              placeholder="Escribe tu mensaje..."
              onChange={(e) => setMensaje(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Enviar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "80vh",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "25%",
    backgroundColor: "#f8f8f8",
    padding: "10px",
    borderRight: "1px solid #ddd",
    overflowY: "auto",
  },
  userItem: {
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fafafa",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "15px",
    maxWidth: "70%",
  },
  form: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    marginLeft: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
  },
};
