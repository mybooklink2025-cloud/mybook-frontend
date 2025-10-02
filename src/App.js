import React, { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <div style={{textAlign: 'center', marginTop: '50px'}}>
      <h1>MyBook</h1>
      {!loggedIn ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <p>Login exitoso</p>
      )}
    </div>
  );
}

export default App;
