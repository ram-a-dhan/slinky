<!-- app/pages/index.vue -->
<script setup lang="ts">
definePageMeta({ middleware: "guest" });

const { isLoggedIn, signIn } = useAuthStore();

watchEffect(() => {
  if (isLoggedIn) navigateTo('/dashboard');
})
</script>

<template>
<div class="toolbar">
  <Toolbar>
    <template #end>
      <Button
        severity="secondary"
        icon="pi pi-google"
        label="Sign in with Google" 
        @click="signIn"
      />
    </template>
  </Toolbar>
</div>
<div class="welcome">

  <div class="welcome__card">
    <div class="welcome__title">
      <h1>🐍 Slinky</h1>
      <p>URL Shortener</p>
    </div>

  </div>
</div>
</template>

<style scoped lang="scss">
.toolbar {
  padding: 0.75rem;
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