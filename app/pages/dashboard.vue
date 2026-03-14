<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "shell" });

const { user } = useAuthStore();
</script>

<template>
<div v-if="user">
  <p>Welcome, {{ user.username }}.</p>
</div>
</template>

<style scoped lang="scss">

</style>