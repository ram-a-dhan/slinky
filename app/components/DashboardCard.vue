<script lang="ts" setup>
interface IDashboardCardProps {
  title?: string;
  value?: number;
}

const props = withDefaults(
  defineProps<IDashboardCardProps>(),
  {
    title: "Metric",
    value: 0,
  },
);

const formatted = computed(() => {
  return new Intl
    .NumberFormat("en-US")
    .format(props.value);
});
</script>

<template>
<div class="card">
  <h3 class="card__title">
    {{ props.title }}
  </h3>
  <i class="card__art pi pi-chart-line" />
  <p class="card__value">
    {{ formatted }}
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

  width: calc((100% - var(--gap) * (var(--col) - 1)) / var(--col));
  min-height: 12.5rem;

  &__title {    
    font-size: 1.25rem;
    z-index: 1;
  }

  &__art {
    position: absolute;
    bottom: 1.25rem;
    left: 0.75rem;
    font-size: 7.5rem;
    color: var(--p-menu-item-focus-background);
  }

  &__value {
    align-self: end;
    font-size: 2.5rem;
    z-index: 1;
  }
}
</style>
