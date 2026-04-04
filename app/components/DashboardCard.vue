<script lang="ts" setup>
interface IDashboardCardProps {
  title: string;
  value: any;
}

const props = defineProps<IDashboardCardProps>();
</script>

<template>
<div class="card">
  <h3 class="card__title">
    {{ props.title }}
  </h3>
  <p class="card__value">
    {{ props.value }}
  </p>
</div>
</template>

<style lang="scss" scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;

  // --p-menu-item-focus-background

  width: calc((100% - var(--gap) * (var(--col) - 1)) / var(--col));
  min-height: 12.5rem;

  &__title {    
    font-size: 1.25rem;
    z-index: 1;
  }

  &__value {
    align-self: end;
    font-size: 2.5rem;
    z-index: 1;
  }
}
</style>
