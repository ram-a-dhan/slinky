<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "shell" });

const auth = useAuthStore();
const confirm = useConfirm();

const popoverRef = ref();
const isShowChangeUsername = ref(false);
const userSettings = ref(
  [
    {
      label: "Account Settings",
      items: [
        {
          label: "Change Username",
          icon: "pi pi-tag",
          action: () => isShowChangeUsername.value = true,
        },
      ]
    }
  ]
);

const toggleUserSettings = (event: any) => {
  popoverRef.value.toggle(event)
};
</script>

<template>
<Toolbar v-if="auth.user" class="user-info">
  <template #start>
    <h4>Welcome, {{ auth.user.username }}.</h4>
  </template>

  <template #end>
    <Button
      severity="contrast"
      variant="text"
      icon="pi pi-cog"
      label="Settings"
      @click="toggleUserSettings"
    />

    <Popover ref="popoverRef">
      <Menu :model="userSettings" class="user-settings">
        <template #submenuheader="{ item }">
          <span class="user-settings__title">{{ item.label }}</span>
        </template>
        <template #item="{ item }">
          <div role="button" v-ripple class="p-ripple user-settings__item" @click="item.action">
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </template>
      </Menu>
    </Popover>
  </template>
</Toolbar>

<ChangeUsernameModal v-model:visible="isShowChangeUsername" />
</template>

<style scoped lang="scss">
.user-settings {
  &__item {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    cursor: pointer;
    user-select: none;
  }
}
</style>