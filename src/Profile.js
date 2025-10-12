import React, { useState, useEffect } from "react";

function Profile({ token }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const decoded = parseJwt(token);
    if (decoded.email) {
      setEmail(decoded.email);
      const savedPicture = localStorage.getItem(`profilePicture_${decoded.email}`);
      if (savedPicture) setProfilePicture(savedPicture);
    }
  }, [token]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Selecciona un archivo");

    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("email", email);

    try {
      const res = await fetch(`${BASE_URL}/auth/upload-profile-picture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Foto subida correctamente");
        setProfilePicture(data.filename);
        localStorage.setItem(`profilePicture_${email}`, data.filename);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch {
      setMessage("❌ Error al conectar con el servidor");
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return {};
    }
  };

  return (
    <div style={{ textAlign: "left", marginTop: "20px", marginLeft: "20px", minHeight: "80vh", position: "relative" }}>
      <h1>
        <a href="/" style={{ color: "blue", textDecoration: "none" }}>MyBook</a>
      </h1>
      <h2>Perfil de usuario</h2>

      {profilePicture && (
        <div>
          <img
            src={`${BASE_URL}/uploads/${profilePicture}`}
            alt="Perfil"
            width={150}
            style={{ borderRadius: "50%" }}
          />
        </div>
      )}

      <form onSubmit={handleUpload} style={{ marginTop: "10px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} /><br />
        <button type="submit">Subir foto</button>
      </form>

      <p style={{ color: "blue" }}>{message}</p>

      {/* Enlace Contáctanos */}
      <div style={{ position: "absolute", bottom: "100px", width: "100%", display: "flex", justifyContent: "center" }}>
        <a href="/contactanos" style={{ color: "blue", fontWeight: "bold", textDecoration: "underline" }}>
          Contáctanos
        </a>
      </div>

      {/* Redes sociales */}
      <div style={{ position: "absolute", bottom: "30px", width: "100%", textAlign: "center" }}>
        <h3>Síguenos en redes sociales</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>Facebook</a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>Instagram</a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>TikTok</a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>X (Twitter)</a>
        </div>
      </div>
    </div>
  );
}

export default Profile;
