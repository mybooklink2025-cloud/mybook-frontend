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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
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
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} /><br />
        <button type="submit">Subir foto</button>
      </form>
      <p style={{ color: "blue" }}>{message}</p>
    </div>
  );
}

export default Profile;
