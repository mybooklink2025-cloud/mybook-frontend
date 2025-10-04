import React, { useState, useEffect } from "react";
import { uploadProfilePicture } from "./api";

function Profile({ token }) {
  const [profilePicture, setProfilePicture] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  // Manejar la selección del archivo
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Subir la foto al backend
  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Selecciona una foto primero");
      return;
    }

    try {
      const data = await uploadProfilePicture(file, token);
      if (data.filename) {
        setProfilePicture(data.filename);
        setMessage("✅ Foto de perfil subida correctamente");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error al subir la foto");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ color: "blue" }}>Perfil Vacío</h1>

      <div style={{ margin: "20px" }}>
        {profilePicture ? (
          <img
            src={`http://localhost:5000/uploads/${profilePicture}`}
            alt="Foto de perfil"
            width="150"
          />
        ) : (
          <p>No hay foto de perfil aún</p>
        )}
      </div>

      <input type="file" onChange={handleFileChange} /><br /><br />
      <button onClick={handleUpload}>Subir foto</button>
      <p style={{ color: "blue" }}>{message}</p>
    </div>
  );
}

export default Profile;
