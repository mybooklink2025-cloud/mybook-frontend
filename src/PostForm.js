import React, { useState } from "react";

function PostForm({ token, onPostCreated }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (response.ok) {
        onPostCreated(data);
        setContent("");
      } else {
        console.error("Error al crear post:", data.message);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <textarea
        placeholder="¿Qué estás pensando?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="post-textarea"
      />
      <button type="submit" className="post-button">Publicar</button>
    </form>
  );
}

export default PostForm;
