import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();
  if (!auth.isLoggedIn) return navigateTo("/", { replace: true });
});
