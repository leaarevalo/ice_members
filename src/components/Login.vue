<template>
  <div class="login-page">
    <v-card class="login-card" max-width="420">
      <!-- Logo -->
      <div class="login-logo-section">
        <v-img
          class="login-logo"
          max-width="64"
          src="https://iglesiadecristotuc.org.ar/media/imagen/top_bar/logo.png"
        ></v-img>
        <h1 class="login-title">ICE Members</h1>
        <p class="login-subtitle">Ingresá con tu cuenta para continuar</p>
      </div>

      <!-- Form -->
      <v-form @submit.prevent="LoginUser" class="login-form">
        <v-text-field
          v-model="username"
          label="Usuario"
          type="text"
          required
          :rules="usernameRules"
          :error-messages="usernameErrors"
          prepend-inner-icon="mdi-account-outline"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          required
          :rules="passwordRules"
          :error-messages="passwordErrors"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          class="login-btn"
        >
          Iniciar sesión
        </v-btn>
      </v-form>
    </v-card>

    <!-- Error Alert -->
    <v-snackbar
      v-model="showError"
      color="error"
      location="top"
      timeout="4000"
    >
      {{ error }}
      <template #actions>
        <v-btn variant="text" @click="showError = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { login } from "../services/login.js";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/store/member";
import { getMembers } from "@/services/members";

const username = ref("");
const password = ref("");
const error = ref("");
const showError = ref(false);
const showPassword = ref(false);
const router = useRouter();
const store = useMemberStore();

//Validaciones usuario
const usernameRules = [
  (v) => !!v || "Usuario es requerido",
  (v) => v.length >= 3 || "Usuario debe tener al menos 3 caracteres",
];
const usernameErrors = ref("");

//Validaciones password
const passwordRules = [
  (v) => !!v || "Contraseña es requerida",
  (v) => v.length >= 6 || "Contraseña debe tener al menos 6 caracteres",
];
const passwordErrors = ref("");

const getUser = async () => {
  try {
    if (localStorage.getItem("member")) return;
    const members = await getMembers();
    store.setMembers(members);
  } catch (err) {
    console.log(err);
  }
};

const LoginUser = async () => {
  try {
    const loginStatus = await login(username.value, password.value);
    if (loginStatus.status === "ok") {
      store.setUser(loginStatus.user);
      getUser();
      router.push("/home");
    }
  } catch (err) {
    console.error("Login error:", err);
    error.value = "Usuario o contraseña incorrectos";
    showError.value = true;
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FAF9F7 0%, #F0EDE6 50%, #E8E3DA 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  padding: 40px 36px 36px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06),
              0 1px 4px rgba(0, 0, 0, 0.04) !important;
}

.login-logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  margin: 0 auto 16px;
  border-radius: 14px;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A1918;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.login-subtitle {
  font-size: 0.9rem;
  color: #6B6560;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.login-btn {
  margin-top: 8px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  font-size: 0.95rem;
}
</style>
