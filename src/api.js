const BASE_URL = process.env.REACT_APP_BACKEND_URL;

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

export const uploadProfilePicture = async (file, token) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const res = await fetch(`${BASE_URL}/auth/upload-profile-picture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return res.json();
};
