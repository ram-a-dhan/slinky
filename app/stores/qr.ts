import { defineStore } from "pinia";
import type { IQrOptions } from "~~/shared/types/data";

export const useQrStore = defineStore("qr", () => {
  const initialValues = ref<IQrOptions>({
    id: "",
    userId: "",
    style: "rounded",
    color1: "000000",
    color2: "000000",
    gradientType: "linear",
    gradientAngle: 0,
    imageUrl: "",
  });
  const qrOptions = ref<IQrOptions>(initialValues.value);
  const isLoading = ref<boolean>(false);

  const fetchQrOptions = async (userId: string) => {
    try {
      isLoading.value = true;

      const response = await $fetch<IRes<IQrOptions>>(`/api/users/${userId}/qr-options`);
      qrOptions.value = response.data || initialValues.value;
    } catch {
      qrOptions.value = initialValues.value;
    } finally {
      isLoading.value = false;
    }
  };

  const clearQrOptions = () => {
    qrOptions.value = initialValues.value;
  };

  return {
    qrOptions,
    isLoading,
    fetchQrOptions,
    clearQrOptions,
  };
});
