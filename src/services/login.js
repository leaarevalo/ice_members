import axios from "axios";

const url = "http://localhost:3000/login";

export async function login(username, password) {
  try {
    console.log("Servicio ejecutado", username, password)
    const { data } = await axios.post(url, {
      username: username,
      password: password
    }); 

    console.log("Respuesta del servicio", data)

    if (data.token) {
      console.log("SET TOKEN");
      localStorage.setItem('token', data.token);
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

