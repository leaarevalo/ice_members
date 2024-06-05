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
//import { VDataTable } from "vuetify/labs/VDataTable";
import * as allComponents from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components: {
    ...allComponents,
    VDateInput,
  },
  directives,
  icons: {
    defaultSet: "mdi",
  },
  date: {
    adapter: new LuxonAdapter,
  },
});

createApp(App).use(vuetify).use(pinia).use(router).mount("#app");
