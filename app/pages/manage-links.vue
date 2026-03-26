<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "shell" });

useHead({ titleTemplate: (title) => `Manage Links | ${title}` });

const auth = useAuthStore();

const isShowLinkShare = ref(false);
const isShowLinkDetail = ref(false);
const linkId = ref<string | undefined>();
const refresh = ref<Function>(() => {});

const fetchList = async (params: IParamsLink) => {
  params.userId = auth.user?.id;
  return await $fetch<IResPage<ILink>>("/api/links", { query: params })
};

const {
  data,
  totalRecords,
  loading,
  first,
  rows,
  onPage,
  onSort,
  search,
  onSearch,
  onClear,
  onRefresh,
} = useDataTable(fetchList);

const setIsShowLinkShare = (id?: string) => {
  if (id) {
    linkId.value = id;
    isShowLinkShare.value = true;
  }
};

const setIsShowLinkDetail = (id?: string) => {
  if (id) {
    linkId.value = id;
    refresh.value = onRefresh;
    isShowLinkDetail.value = true;
  } else {
    linkId.value = undefined;
    refresh.value = onClear;
    isShowLinkDetail.value = true;
  }
};
</script>

<template>
<div class="container">
  <Toolbar>
    <template #start>
      <Button
        severity="contrast"
        variant="text"
        icon="pi pi-plus"
        label="New"
        @click="() => setIsShowLinkDetail()"
      />
    </template>
    <template #end>
      <form @submit.prevent="onSearch">
        <InputGroup>
          <InputText
            name="search"
            placeholder="Search"
            :disabled="loading"
            v-model="search"
          />
          <Button
            type="reset"
            severity="secondary"
            variant="outlined"
            icon="pi pi-times"
            :disabled="loading"
            @click="onClear"
          />
        </InputGroup>
      </form>
    </template>
  </Toolbar>

  <div class="card">
    <DataTable
      :value="data"
      :totalRecords="totalRecords"
      :loading="loading"
      :first="first"
      :rows="rows"
      lazy
      @page="onPage"
      @sort="onSort"
      paginator
      paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink"
      currentPageReportTemplate="{currentPage} / {totalPages}"
    >
      <Column field="slug" header="Slug"></Column>
      <Column field="target" header="Target"></Column>
      <Column style="width: 80px;">
        <template #body="slotProps: { data: ILink }">
          <div class="action-column">
              <Button
                severity="contrast"
                variant="text"
                icon="pi pi-share-alt"
                v-tooltip.top="{ value: 'Share' }"
                @click="() => setIsShowLinkShare(slotProps.data.id)"
              />
              <Button
                severity="contrast"
                variant="text"
                icon="pi pi-pencil"
                v-tooltip.top="{ value: 'Edit' }"
                @click="() => setIsShowLinkDetail(slotProps.data.id)"
              />
          </div>
        </template>
      </Column>
      <template #empty>
        <div class="empty">
          <i class="pi pi-inbox card__icon" />
          <p class="card__caption">
            Empty
          </p>
        </div>
      </template>
    </DataTable>
  </div>

  <LinkShareModal
    v-model:visible="isShowLinkShare"
    :linkId="linkId"
  />
  <LinkDetailModal
    v-model:visible="isShowLinkDetail"
    :linkId="linkId"
    :refresh="refresh"
  />
</div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1.25rem;
}

.card {
  &__icon {
    display: block;
    font-size: 2rem;
  }

  &__caption {
    display: block;
    font-size: 1rem;
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.action-column {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
}

.table-fix-paginator-current-page * .p-paginator-current {
  line-height: 10rem;
}
</style>