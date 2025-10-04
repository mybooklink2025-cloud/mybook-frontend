import React, { useState, useEffect } from "react";

function Profile({ token }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const savedPicture = localStorage.getItem("profilePicture");
    if (savedPicture) setProfilePicture(savedPicture);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Selecciona un archivo");

    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("email", parseJwt(token).email);

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
        localStorage.setItem("profilePicture", data.filename);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
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
    <div style={{ textAlign: "left", marginTop: "50px", marginLeft: "20px" }}>
      {/* MyBook arriba-izquierda */}
      <h1 style={{ color: "blue" }}>MyBook</h1>

      {/* Título perfil */}
      <h2 style={{ marginTop: "10px" }}>Perfil de usuario</h2>

      {/* Foto de perfil */}
      {profilePicture && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={`${BASE_URL}/uploads/${profilePicture}`}
            alt="Perfil"
            width={150}
            style={{ borderRadius: "50%" }}
          />
        </div>
      )}

      {/* Subir foto */}
      <form onSubmit={handleUpload} style={{ marginTop: "20px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} /><br />
        <button type="submit" style={{ marginTop: "10px" }}>Subir foto</button>
      </form>

      <p style={{ color: "blue", marginTop: "10px" }}>{message}</p>
    </div>
  );
}

export default Profile;
