const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const registrarUsuario = async (usuarioData) => {
  const res = await fetch(`${backendUrl}/api/usuarios/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioData)
  });
  return res.json();
};

export const loginUsuario = async (loginData) => {
  const res = await fetch(`${backendUrl}/api/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData)
  });
  return res.json();
};
