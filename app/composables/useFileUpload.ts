import type { FileUploadSelectEvent } from "primevue";

export const useFileUpload = () => {
  const fileUploadPreview = ref<string>();
  const fileUploadFile = ref<File>();
  const fileUploadKey = ref(0);

  const onFileSelect = async (event: FileUploadSelectEvent) => {
    fileUploadFile.value = event.files[0];
    
    clearPreview();
    
    if (fileUploadFile.value) {
      fileUploadPreview.value = URL.createObjectURL(fileUploadFile.value);
    }
  };

  const clearFile = () => {
    fileUploadKey.value++;
    fileUploadFile.value = undefined;

    clearPreview();
  };

  const clearPreview = () => {
    if (fileUploadPreview.value) {
      URL.revokeObjectURL(fileUploadPreview.value);
      fileUploadPreview.value = undefined;
    }
  };

  return {
    fileUploadPreview,
    fileUploadFile,
    fileUploadKey,
    onFileSelect,
    clearFile,
    clearPreview,
  };
};