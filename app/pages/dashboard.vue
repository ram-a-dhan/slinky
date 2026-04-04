<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";
import DashboardCard from "~/components/DashboardCard.vue";

definePageMeta({ middleware: "auth", layout: "shell" });

useHead({ titleTemplate: (title) => `Dashboard | ${title}` });

const auth = useAuthStore();
const confirm = useConfirm();
const { isMobile } = useMobile(600);

const popoverRef = ref();
const isShowCustomizeQrCode = ref(false);
const isShowChangeUsername = ref(false);
const isShowDeleteAccount = ref(false);
const userSettings = ref<MenuItem[]>(
  [
    {
      label: "Link Settings",
      items: [
        {
          label: "Customize QR Code",
          icon: "pi pi-qrcode",
          action: () => isShowCustomizeQrCode.value = true,
        },
      ],
    },
    {
      label: "Account Settings",
      items: [
        {
          label: "Change Username",
          icon: "pi pi-tag",
          action: () => isShowChangeUsername.value = true,
        },
        {
          label: "Delete Account",
          icon: "pi pi-trash",
          action: () => confirm.require({
            header: "Delete Account",
            message: `Hold up! You are about to delete your account which cannot be undone. Deleting your account will also delete all your links. Are you sure you want to proceed?`,
            icon: "pi pi-exclamation-triangle",
            acceptProps: {
              severity: "danger",
              label: "Proceed",
            },
            rejectProps: {
              severity: "secondary",
              label: "Cancel",
            },
            accept: () => isShowDeleteAccount.value = true,
          }),
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
<div class="container">
  <Toolbar v-if="auth.user" class="user-info">
    <template #start>
      <h4>Welcome, {{ auth.user.username }}.</h4>
    </template>
  
    <template #end>
      <Button
        severity="contrast"
        variant="text"
        icon="pi pi-refresh"
        :label="isMobile ? undefined : 'Refresh'"
        @click="auth.fetchUser"
        :loading="auth.isLoading"
      />
      <Button
        severity="contrast"
        variant="text"
        icon="pi pi-cog"
        :label="isMobile ? undefined : 'Settings'"
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
  
  <div class="dashboard">
    <DashboardCard title="Total Links" :value="auth.user?.linkCount" />
    <DashboardCard title="Total Hit" :value="auth.user?.hitCount" />
  </div>
</div>

<CustomizeQrCodeModal v-model:visible="isShowCustomizeQrCode" />
<ChangeUsernameModal v-model:visible="isShowChangeUsername" />
<DeleteAccountModal v-model:visible="isShowDeleteAccount" />
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  container-type: inline-size;
}

.user-settings {
  &__item {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    cursor: pointer;
    user-select: none;
  }
}

.dashboard {
  --gap: 1.25rem;
  --col: 4;

  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);


  @container (max-width: calc(1200px - 1px)) { --col: 3 }
  @container (max-width: calc(900px - 1px)) { --col: 2 }
  @container (max-width: calc(600px - 1px)) { --col: 1 }
}
</style>