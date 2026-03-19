<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "shell" });

const auth = useAuthStore();

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
} = useDataTable(fetchList);
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
              />
              <Button
                severity="contrast"
                variant="text"
                icon="pi pi-pencil"
                v-tooltip.top="{ value: 'Edit' }"
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
  padding: var(--p-toolbar-padding);
  background: var(--p-toolbar-background);
  border: 1px solid var(--p-toolbar-border-color);
  color: var(--p-toolbar-color);
  border-radius: var(--p-toolbar-border-radius);

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