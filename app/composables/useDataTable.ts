// composables/useDataTable.ts
import type { DataTablePageEvent, DataTableSortEvent } from "primevue";
import { ref, onMounted } from 'vue';

interface IUseDataTableOptions<T extends object> {
  size?: number;
  sort?: keyof T;
  order?: IParams["order"];
}

export const useDataTable = <T extends object>(
  fetchList: (params: any) => Promise<IResPage<T>>,
  options: IUseDataTableOptions<T> = {}
) => {
  const toast = useToast();

  // 1. Table Data & UI State
  const data = ref<T[]>([]);
  const totalRecords = ref(0);
  const loading = ref(false);

  // 2. Pagination & Sort State
  const first = ref(0); // Pagination offset.
  const size = ref(options.size || 10);
  const sort = ref(options.sort|| "createdAt");
  const order = ref(options.order || "desc");
  const search = ref<string | undefined>(undefined);

  // 3. The Core Fetch Logic
  const loadData = async () => {
    try {      
      loading.value = true;
    
      const response = await fetchList({
        page: Math.floor(first.value / size.value) + 1,
        size: size.value,
        sort: sort.value,
        order: order.value,
        search: search.value?.trim() || undefined,
      });

      data.value = response.data as T[];
      if (response.paging.page === 1) {
        totalRecords.value = response.paging.total;
      }
    } catch (error) {
      const { statusMessage } = error as IRes;
      const { message } = error as Error;
      toast.add({
        severity: "error",
        summary: "Error",
        detail: statusMessage || message,
        life: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  // 4. Event Handlers (passed directly to PrimeVue)
  const onPage = (event: DataTablePageEvent) => {
    first.value = event.first;
    size.value = event.rows;
    loadData();
  };

  const onSort = (event: DataTableSortEvent) => {
    sort.value = event.sortField;
    order.value = event.sortOrder === 1 ? "asc" : "desc";
    loadData();
  };

  const onSearch = () => {
    if (search.value && search.value.trim().length >= 4) {
      first.value = 0;
      loadData();
    } else {
      toast.add({
        severity: "error",
        summary: "Search Validation",
        detail: "Search keyword must be at least 4 non whitespace characters.",
        life: 3000,
      });
    }
  };

  const onClear = () => {
    first.value = 0;
    search.value = undefined;
    loadData();
  };

  onMounted(() => loadData());

  return {
    data,
    totalRecords,
    loading,
    first,
    rows: size,
    sortField: sort,
    sortOrder: order,
    onPage,
    onSort,
    search,
    onSearch,
    onClear,
    refresh: loadData
  };
}