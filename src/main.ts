import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import { routes } from "./routes";
import "./index.css";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App);
const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: import.meta.hot ? [] : routes,
});

let removeRoutes: Array<() => void> = [];

if (import.meta.hot) {
  for (const route of routes) {
    removeRoutes.push(router.addRoute(route));
  }
}
if (import.meta.hot) {
  import.meta.hot?.accept("./routes.ts", ({ routes }: any) => {
    for (const removeRoute of removeRoutes) removeRoute();
    removeRoutes = [];
    for (const route of routes) {
      removeRoutes.push(router.addRoute(route));
    }
    router.replace("");
  });
}

app.use(pinia);
app.use(PrimeVue, {
  theme: { preset: Aura, options: { darkModeSelector: "none" } },
});
app.use(ConfirmationService);
app.use(router);
app.mount("#app");
