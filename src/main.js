import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./routes";

const pinia = createPinia();

// Vuetify
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
//import { VDataTable } from "vuetify/labs/VDataTable";
import * as allComponents from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components: {
    ...allComponents,
  },
  directives,
  icons: {
    defaultSet: "mdi",
  },
});

createApp(App).use(vuetify).use(pinia).use(router).mount("#app");
