<template>
  <v-app>
    <MainView />
  </v-app>
</template>

<script>
import MainView from "./MainView.vue";

export default {
  name: "App",
  components: {
    MainView,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1A1918;
}

/* Global transitions */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #D4D0C8;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #B8B4AC;
}

/* Override Vuetify data table styles */
.v-data-table .v-data-table-header {
  background-color: #F5F3EF !important;
}
.v-data-table tbody tr:hover {
  background-color: #FAF9F7 !important;
}
</style>
