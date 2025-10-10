// src/api.js

// URL del backend desplegado en Render
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://mybook-7a9s.onrender.com/api";

export const registrarUsuario = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const loginUsuario = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const enviarContacto = async ({ nombre, email, mensaje }) => {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, mensaje }),
  });
  return res.json();
};
