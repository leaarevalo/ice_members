import axios from "axios";

const url = "http://localhost:3000/auth/login";

export async function login(username, password) {
  try {
    const { data } = await axios.post(url, {
      username: username,
      password: password
    }); 


    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      return {
        status: "ok",
        user: data.user
      };
    } else {
      return {status: "error"};
    }
  } catch (error) {
    console.error('Error en la solicitud de inicio de sesión:', error);
    throw error;
  }
}

export function isAuthenticated() {
  const token = localStorage.getItem('access_token');
  return !!token;
}

export function getToken() {
  return localStorage.getItem('access_token');
}

export function logout() {
  localStorage.removeItem('access_token');
}

