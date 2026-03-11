import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuthStore();
  await fetchUser();
});
