<script setup lang="ts">
useHead({
  title: "Slinky - Fast & Free URL Shortener",
  titleTemplate: (title) => `${title}`, 
  htmlAttrs: { lang: "en" } ,
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicon.svg",
    },
  ],
});
</script>

<template>
<NuxtLayout>
  <NuxtPage />
</NuxtLayout>

<ConfirmDialog style="width: 500px;" />
<Toast />
</template>
