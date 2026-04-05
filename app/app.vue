<script setup lang="ts">
const config = useRuntimeConfig();

useHead({
  title: "Slinky - URL Shortener",
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

useSeoMeta({
  title: "Slinky - URL Shortener",
  description: "Shorten long URLs in one click, generate QR codes, with style!",
  ogTitle: "Slinky - URL Shortener",
  ogDescription: "Shorten long URLs in one click, generate QR codes, with style!",
  ogImage: `${config.public.BASE_URL}/og-image.png`,
  twitterImage: `${config.public.BASE_URL}/og-image.png`,
  twitterCard: "summary_large_image",
});

useSchemaOrg([
  defineWebSite({
    name: "Slinky",
    url: config.public.BASE_URL,
  }),
  {
    "@type": "WebApplication",
    name: "URL Shortener",
    applicationCategory: 'UtilitiesApplication',
  },
]);
</script>

<template>
<NuxtLayout>
  <NuxtPage />
</NuxtLayout>

<ConfirmDialog style="width: 500px;" />
<Toast />
</template>
