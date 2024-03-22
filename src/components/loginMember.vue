<template>
    <div>
      <v-img
        class="mx-auto my-6"
        max-width="228"
        src="https://iglesiadecristotuc.org.ar/media/imagen/top_bar/logo.png"
      ></v-img>
  
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>
  
        <v-text-field
          v-model="email"
          density="compact"
          placeholder="Email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>
  
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          password
  
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Forgot login password?</a>
        </div>
  
        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>
  
  
        <v-btn
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="login"
        >
          Log In
        </v-btn>
  
        <v-card-text class="text-center">
          <a
            class="text-blue text-decoration-none"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue'
    const visible = ref(false)

  let email = ref('')
  let password = ref('')

  const login = () => {
    console.log('Email:', email.value)
    console.log('Password:', password.value)

  }
  </script>
  
  <script>
  export default {
    data: () => ({
      visible: false,
    }),
  }
</script>