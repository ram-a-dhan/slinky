<!-- app/pages/index.vue -->
<script setup lang="ts">
const config = useRuntimeConfig();

definePageMeta({ middleware: "guest" });

useSeoMeta({
  title: "Slinky - Free & Fast URL Shortener",
  description: "Shorten long URLs in one click, generate QR codes, with style!",
  ogTitle: "Slinky - Free & Fast URL Shortener",
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

const isShowLogin = ref(false);

const { isLoggedIn } = useAuthStore();

watchEffect(() => {
  if (isLoggedIn) navigateTo('/dashboard');
});

const setIsShowLogin = () => {
  isShowLogin.value = !isShowLogin.value;
};
</script>

<template>
<div class="toolbar">
  <Toolbar>
    <template #end>
      <Button
        severity="contrast"
        variant="text"
        icon="pi pi-sign-in"
        label="Sign In"
        @click="setIsShowLogin"
      />
    </template>
  </Toolbar>
</div>

<div class="content">
  <HomeCard />
</div>

<LoginModal v-model:visible="isShowLogin" />
</template>

<style scoped lang="scss">
.toolbar {
  padding: 0.75rem;
}

.logo {
  height: 1.5rem;
  aspect-ratio: 1;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.75rem 0.75rem;
}

</style>