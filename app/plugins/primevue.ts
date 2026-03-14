import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

export default defineNuxtPlugin(nuxtApp => {
  const app = nuxtApp.vueApp
  if (!app.config.globalProperties.$toast) {
    app.use(ToastService);
  }
  if (!app.config.globalProperties.$confirm) {
    app.use(ConfirmationService);
  }
});
