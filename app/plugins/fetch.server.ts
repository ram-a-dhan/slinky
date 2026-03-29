export default defineNuxtPlugin(() => {
  const headers = useRequestHeaders(['cookie']);

  globalThis.$fetch = $fetch.create({ headers });
})