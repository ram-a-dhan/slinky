import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return; // skip on server-side

  const auth = useAuthStore();
  if (!auth.isLoggedIn) return navigateTo("/", { replace: true });
});
