<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
    <v-img class="mx-auto my-6" max-width="228"
      src="https://iglesiadecristotuc.org.ar/media/imagen/top_bar/logo.png"></v-img>

        <v-form @submit.prevent="LoginUser">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
            :rules="emailRules"
            :error-messages="emailErrors"
          ></v-text-field>
          
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
            :rules="passwordRules"
            :error-messages="passwordErrors"
          ></v-text-field>
          
          <v-btn
            type="submit"
            class="mr-4"
          >
            Login
          </v-btn>
        </v-form>
      </v-card>
      <v-alert
          v-if="error"
          type="error"
          dismissible
          variant="tonal"
        >
          {{ error }}
      </v-alert>
</template>

<script setup>
  import { ref } from 'vue';
  import { login } from '../services/login.js';

  const email = ref('');
  const password = ref('');
  const error = ref('');
  
  //Validaciones email
  const emailRules = [
    (v) => !!v || 'Email es requerido',
    (v) => /.+@.+\..+/.test(v) || 'Email debe ser válido'
  ];
  const emailErrors = ref('');
  
    //Validaciones password
  const passwordRules = [
    (v) => !!v || 'Password es requerido',
    (v) => v.length >= 6 || 'Password debe tener al menos 6 caracteres'
  ];
  const passwordErrors = ref('');

  const LoginUser = async () => {
    try {
      const userData = await login(email.value, password.value);
      console.log('Usuario autenticado:', userData);
    } catch (error) {
      error.value = error;
    }
  };
</script>