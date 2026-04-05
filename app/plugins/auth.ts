export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();
  const qr = useQrStore();

  await callOnce(async () => {
    await auth.fetchUser();
  
    if (auth.user?.id) {
      await qr.fetchQrOptions(auth.user.id);
    }
  });
});
