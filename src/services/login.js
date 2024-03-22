import axios from "axios";

const url = "https://ice-members.onrender.com";

export async function LoginUser(user) {
    axios.post(`${url}/login`, {
      email: user.email,
      password: user.password,
    });
  }

