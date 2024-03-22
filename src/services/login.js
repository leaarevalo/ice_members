import axios from "axios";

const url = "https://ice-members.onrender.com";

export async function login(email, password) {
  try {
    console.log("Servicio ejecutado")
    const response = await axios.post(url, {
      email: email,
      password: password
    }); 

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Error de inicio de sesión');
    }
  } catch (error) {
    console.error('Error en la solicitud de inicio de sesión:', error);
    throw error;
  }
  }

