import React, { useState } from "react";

function Contactanos() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState("");

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.message);
        setNombre("");
        setEmail("");
        setMensaje("");
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch {
      setStatus("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ color: "blue" }}>MyBook - Contáctanos</h1>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
        <label>Nombre:</label><br />
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required /><br /><br />
        
        <label>Correo:</label><br />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br /><br />

        <label>Mensaje:</label><br />
        <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={4} cols={30} required /><br /><br />

        <button type="submit">Enviar</button>
      </form>
      <p style={{ color: "blue", marginTop: "10px" }}>{status}</p>
    </div>
  );
}

export default Contactanos;
