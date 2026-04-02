<script lang="ts" setup>

const visible = defineModel<boolean>("visible", { required: true });

const { signIn } = useAuthStore();

</script>

<template>
<Dialog v-model:visible="visible" modal header="Sign In">
  <div class="login-modal">
    <p>Sign in to have customizable shortlinks and QR Codes.</p>
  
    <Button
      severity="info"
      icon="pi pi-google"
      label="Sign In with Google"
      @click="signIn"
    />
  </div>
</Dialog>
</template>

<style lang="scss" scoped> 
.login-modal {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
