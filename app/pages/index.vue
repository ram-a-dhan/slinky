<!-- app/pages/index.vue -->
<script setup lang="ts">
const config = useRuntimeConfig();

definePageMeta({ middleware: "guest" });

const isShowLogin = ref(false);

const auth = useAuthStore();

watchEffect(() => {
  if (auth.isLoggedIn) navigateTo('/dashboard');
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

<Dialog
  v-model:visible="auth.isLoading"
  modal  
>
  <template #container>
    <span class="loading">
      <span>
        Checking credentials...
      </span>
      <Button
        severity="contrast"
        variant="text"
        disabled
        icon="pi pi-spinner pi-spin"
      />
    </span>
  </template>
</Dialog>

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

.loading {
  display: flex;
  align-items: center;
  
  > span {
    padding: 0.75rem 0 0.75rem 0.75rem;
  }
}
</style>