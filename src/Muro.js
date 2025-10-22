import React, { useState, useEffect } from "react";
import "./Muro.css";

function Muro() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
    <div className="muro-container">
      <h2>Publicaciones</h2>

      <div className="post-box">
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
              <img
                src={post.userPhoto}
                alt="Foto de usuario"
                className="post-user-photo"
              />
              <span className="post-user-name">{post.userName}</span>
            </div>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      <footer className="social-footer">
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
      </footer>
    </div>
  );
}

export default Muro;
