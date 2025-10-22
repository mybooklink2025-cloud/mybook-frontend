import React, { useState, useEffect } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!profilePic || !user) return;
    const formData = new FormData();
    formData.append("profilePicture", profilePic);
    formData.append("email", user.email);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/upload-profile-picture`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.filename) {
        const updatedUser = { ...user, profilePicture: data.filename };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error al subir la foto:", error);
    }
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const nuevoPost = {
      id: Date.now(),
      content: newPost,
      userName: user?.email?.split("@")[0] || "Usuario",
      userPhoto: user?.profilePicture
        ? `${process.env.REACT_APP_BACKEND_URL}/uploads/${user.profilePicture}`
        : "/default-profile.png",
    };
    setPosts([nuevoPost, ...posts]);
    setNewPost("");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-left">
          <img
            src={
              user?.profilePicture
                ? `${process.env.REACT_APP_BACKEND_URL}/uploads/${user.profilePicture}`
                : preview || "/default-profile.png"
            }
            alt="Foto de perfil"
            className="profile-pic"
          />
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Subir foto</button>
        </div>

        <div className="profile-info">
          <h2>{user?.email?.split("@")[0]}</h2>
        </div>
      </div>

      <div className="post-section">
        <textarea
          placeholder="¿Qué estás pensando?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handlePost}>Publicar</button>
      </div>

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <img src={post.userPhoto} alt="Foto de usuario" className="post-user-photo" />
              <span className="post-user-name">{post.userName}</span>
            </div>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      <footer className="social-footer">
        <a href="/contacto" className="contact-link">Contáctanos</a>
        <div className="social-links">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i> Facebook
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i> Twitter
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i> Instagram
          </a>
          <a href="https://web.whatsapp.com/send?phone=573024502105" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i> WhatsApp 3024502105
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Profile;
