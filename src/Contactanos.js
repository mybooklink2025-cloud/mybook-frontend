import React, { useState } from "react";

export default function Contactanos() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [status, setStatus] = useState("");

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://mybook-7a9s.onrender.com";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");

    try {
      const res = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Mensaje enviado con éxito");
        setForm({ nombre: "", email: "", mensaje: "" });
      } else {
        setStatus(`❌ Error: ${data.message || "No se pudo enviar el mensaje"}`);
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ color: "blue" }}>MyBook</h1>
      <nav style={{ marginBottom: "20px" }}>
        <a href="/">Iniciar sesión</a> | <a href="/register">Registrarse</a> | <a href="/contactanos">Contáctanos</a>
      </nav>

      <h2>Contáctanos</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Nombre:</label><br />
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label><br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Mensaje:</label><br />
          <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required />
        </div>
        <button type="submit">Enviar</button>
      </form>

      {status && <p style={{ marginTop: "20px" }}>{status}</p>}
    </div>
  );
}
