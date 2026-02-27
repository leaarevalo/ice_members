import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./routes";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Vuetify
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import LuxonAdapter from "@date-io/luxon"
import { VDateInput } from 'vuetify/labs/VDateInput'
import * as allComponents from "vuetify/components";
import * as directives from "vuetify/directives";

const claudeTheme = {
  dark: false,
  colors: {
    primary: '#D97706',
    secondary: '#6B6560',
    background: '#FAF9F7',
    surface: '#FFFFFF',
    'surface-variant': '#F5F3EF',
    error: '#DC2626',
    success: '#16A34A',
    'on-primary': '#FFFFFF',
    'on-background': '#1A1918',
    'on-surface': '#1A1918',
  },
};

const vuetify = createVuetify({
  components: {
    ...allComponents,
    VDateInput,
  },
  directives,
  theme: {
    defaultTheme: 'claude',
    themes: {
      claude: claudeTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
  date: {
    adapter: new LuxonAdapter,
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      variant: 'flat',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
    },
    VCard: {
      rounded: 'xl',
      elevation: 0,
    },
  },
});

createApp(App).use(vuetify).use(pinia).use(router).mount("#app");
