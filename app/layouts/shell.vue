<script setup lang="ts">
const { signOut } = useAuthStore()

// Page Title from route.
const route = useRoute();
const pageName = computed(() => {
  if (!route.name) return "Home";
  return route.name
  .toString()
  .split(/[-_]/)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
});

// Toggle drawer.
const isShowDrawer = ref(false);
const setIsShowDrawer = () => {
  isShowDrawer.value = !isShowDrawer.value;
}

// Switch between drawer or sidebar based on viewport width.
const viewWidth = ref(900);
const handleWidth = () => {
  viewWidth.value = window.innerWidth;
};
onMounted(() => {
  handleWidth();
  window.addEventListener("resize", handleWidth);
})
onUnmounted(() => {
  window.removeEventListener("resize", handleWidth);
})
const isMobile = computed(() => viewWidth.value < 900);

// Confirm signing out
const confirm = useConfirm();
const toast = useToast();
const confirmSignOut = () => {
  return confirm.require({
    header: "Sign Out?",
    message: "Are you sure you want to sign out?",
    icon: "pi pi-info-circle",
    acceptProps: {
      label: "Sign Out",
      severity: "danger",
    },
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
    },
    accept: () => {
      toast.add({ severity: "success", summary: "Signed Out", detail: "You have successfully signed out.", life: 3000  });
      signOut();
    },
  });
};

// navigation links
const navItems = ref([
  { label: "Dashboard", icon: "pi pi-home", path: "/dashboard" },
  { label: "Manage Links", icon: "pi pi-link", path: "/manage-links" },
]);
const settingItems = ref([
  { label: "Sign Out", icon: "pi pi-sign-out", action: confirmSignOut },
]);

</script>

<template>
<div class="shell">
  <Drawer
    v-if="isMobile"
    :visible="isShowDrawer"
    @update:visible="setIsShowDrawer"
    header="🐍 Slinky"
  >
    <aside class="drawer">
      <nav class="drawer__nav">
        <Menu :model="navItems">
          <template #item="{ item }">
            <NuxtLink :to="item.path"  v-ripple class="p-ripple nav-item" @click="setIsShowDrawer">
              <i :class="item.icon" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </template>
        </Menu>
      </nav>
      <div class="drawer__settings">
        <Menu :model="settingItems">
          <template #item="{ item }">
            <div role="button"  v-ripple class="p-ripple nav-item" @click="item.action">
              <i :class="item.icon" />
              {{ item.label }}
            </div>
          </template>
        </Menu>
      </div>
    </aside>
  </Drawer>

  <aside v-if="!isMobile" class="sidebar">
    <div class="sidebar__brand">
      <h1>🐍 Slinky</h1>
    </div>
    <nav class="sidebar__nav">
      <Menu :model="navItems">
        <template #item="{ item }">
          <NuxtLink :to="item.path"  v-ripple class="p-ripple nav-item">
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>
      </Menu>
    </nav>
    <div class="sidebar__settings">
      <Menu :model="settingItems">
        <template #item="{ item }">
          <div role="button"  v-ripple class="p-ripple nav-item" @click="item.action">
            <i :class="item.icon" />
            {{ item.label }}
          </div>
        </template>
      </Menu>
    </div>
  </aside>
  
  <div class="layout">
    <div class="topbar">
      <h2>{{ pageName }}</h2>
      <Button
      v-if="isMobile"
      variant="text"
      severity="secondary"
      icon="pi pi-bars"
      @click="setIsShowDrawer"
      />
    </div>

    <div class="content">
      <slot />
    </div>
  </div>
</div>



</template>

<style scoped lang="scss">
.shell {
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  border-right: 1px solid var(--p-toolbar-border-color);

  &__brand h1 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  &__settings {
    margin-top: auto;

    .nav-item {
      cursor: pointer;
    }
  }
}

.drawer {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;

  &__settings {
    margin-top: auto;

    .nav-item {
      cursor: pointer;
    }
  }
}

.nav-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid var(--p-toolbar-border-color);
  font-size: 1rem;
}

.content {
  padding: 1.25rem;
}
</style>