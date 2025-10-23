import React, { useEffect, useState } from "react";

function PostList({ token }) {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPosts(data.reverse());
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <p><strong>{post.user}</strong></p>
          <p>{post.content}</p>
          <small>{new Date(post.date).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default PostList;
