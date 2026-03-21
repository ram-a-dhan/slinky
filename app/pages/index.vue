<!-- app/pages/index.vue -->
<script setup lang="ts">
definePageMeta({ middleware: "guest" });

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

<div class="welcome">
  <div class="welcome__card">
    <div class="welcome__title">
      <h1>
        <img src="/favicon.svg" alt="Slinky Logo" class="logo">
        Slinky
      </h1>
      <p>URL Shortener</p>
    </div>
  </div>
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

.welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  
  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    width: 100%;
  }

  &__title {
    text-align: center;
  }
}
</style>