import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={<Register onRegister={handleLogin} />}
        />
        <Route
          path="/profile"
          element={token ? <Profile token={token} /> : <Login onLogin={handleLogin} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
