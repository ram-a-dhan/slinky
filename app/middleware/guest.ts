import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn } = useAuthStore();
  if (isLoggedIn) return navigateTo("/dashboard");
});
