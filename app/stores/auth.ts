import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<IUser | null>(null);
  const isLoading = ref<boolean>(false);
  const isLoggedIn = computed(() => user.value !== null);
  const qr = useQrStore();

  const fetchUser = async () => {
    try {
      isLoading.value = true;

      const headers = useRequestHeaders(["cookie"]);
      user.value = await $fetch("/api/auth/session", { headers });
    } catch {
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const signIn = async () => {
    window.location.href = "/api/auth/google";
  };

  const signOut = async () => {
    const logout = await $fetch<{ success: boolean }>(
      "/api/auth/logout",
      { method: HTTP_METHOD.POST },
    );

    if (logout.success) {
      qr.clearQrOptions();
      user.value = null;
      await navigateTo("/");
    }
  };

  return {
    user,
    isLoading,
    isLoggedIn,
    fetchUser,
    signIn,
    signOut,
  };
});
