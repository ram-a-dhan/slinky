<script lang="ts" setup>
import type { FormInstance, FormSubmitEvent } from "@primevue/forms";
import type { FileUpload } from "primevue";

const visible = defineModel<boolean>("visible", { required: true });

const toast = useToast();
const auth = useAuthStore();
const qr = useQrStore();
const {
  shortlink,
  renderQRCode,
} = useShortLink({ toast });
const {
  fileUploadFile,
  fileUploadPreview,
  fileUploadKey,
  onFileSelect,
  clearFile,
} = useFileUpload();

shortlink.value = "Slinky - URL Shortener";

const formRef = ref<FormInstance>();
const initialValues = ref(qr.qrOptions);
const loading = ref(false);
const formKey = ref(0);
const styleList = ref([
  { value: "rounded", label: "Rounded" },
  { value: "circles", label: "Circles" },
  { value: "diamond", label: "Diamond" },
]);
const gradientTypeList = ref([
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
]);

watch(visible, async (val) => {
  if (val === true) {
    await nextTick();
    await renderQRCode(qr.qrOptions);
    
    initialValues.value = qr.qrOptions;
    formKey.value++;
  } else {
    clearFile();
  }
});

const onSubmit = async (event: FormSubmitEvent) => {
  const options = extractFormData(event.states);

  try {
    loading.value = true;

    const body = new FormData();
    body.append("style", options.style);
    body.append("color1", options.color1);
    body.append("color2", options.color2);
    body.append("gradientType", options.gradientType);
    body.append("gradientAngle", options.gradientAngle);
    if (fileUploadFile.value) {
      body.append("image", fileUploadFile.value);
    }

    const response = await $fetch<IRes<IQrOptions>>(
      `/api/users/${auth.user?.id!}/qr-options`,
      {
        method: HTTP_METHOD.POST,
        body,
      },
    )
    if (response.statusCode === HTTP_STATUS.CREATED) {
      qr.fetchQrOptions(auth.user?.id!);
      clearFile();
      toast.add({
        severity: "success",
        summary: "Success",
        detail: response.statusMessage,
        life: 3000,
      });
      visible.value = false;
    }
  } catch (error) {
    const { statusMessage } = error as IRes || {};
    const { message } = error as Error || {};
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

const onFileDelete = () => {
  clearFile();
  onChange();
};

const onChange = async () => {
  await nextTick();

  const options = extractFormData(formRef.value?.states!);
  if (fileUploadPreview.value) {
    options.imageUrl = fileUploadPreview.value;
  }

  await renderQRCode({
    ...qr.qrOptions,
    ...options,
  });
};

const debouncedOnChange = useDebounce(onChange, 2000);

</script>

<template>
<Dialog
  v-model:visible="visible"
  header="Customize QR Code"
  style="width: 100%; max-width: 50rem;"
  modal
>
  <div class="row">
    <div class="col">
      <Fieldset legend="Preview">
        <div class="qrcode-preview" ref="qrBox" />
      </Fieldset>
    </div>

    <div class="col">
      <Form
        v-slot="$form"
        ref="formRef"
        :key="formKey"
        :initialValues="initialValues"
        @submit="onSubmit"
        class="user-form"
      >
        <!-- STYLE -->
        <Fieldset legend="Style">
          <Select
            name="style"
            :options="styleList"
            optionValue="value"
            optionLabel="label"
            fluid
            @change="onChange"
            :disabled="loading"
          />
        </Fieldset>

        <!-- COLORS -->
        <Fieldset legend="Colors">
          <div class="qr-form__colors">
            <div class="labeled">
              <ColorPicker
                name="color1"
                inputId="color1"
                format="hex"
                :defaultColor="initialValues.color1"
                @change="debouncedOnChange"
                :disabled="loading"
              />
              <label for="color1">
                #{{ $form.color1?.value }}
              </label>
            </div>
            <div class="labeled">
              <ColorPicker
                name="color2"
                inputId="color2"
                format="hex"
                :defaultColor="initialValues.color2"
                @change="debouncedOnChange"
                :disabled="loading"
              />
              <label for="color2">
                #{{ $form.color2?.value }}
              </label>
            </div>
            <i
              class="pi pi-info-circle"
              v-tooltip.top="{ value: 'Choose darker colors so it can be read by QR code scanners.' }"
            />
          </div>
        </Fieldset>

        <!-- GRADIENT -->
        <Fieldset legend="Gradient">
          <div class="qr-form__gradient">
            <div class="qr-form__gradient-type">
              <div class="labeled" v-for="gradType in gradientTypeList">
                <RadioButton
                  :inputId="gradType.value"
                  name="gradientType"
                  :value="gradType.value"
                  @change="onChange"
                  :disabled="loading"
                />
                <label :for="gradType.value">
                  {{ gradType.label }}
                </label>
              </div>
            </div>
            <div class="qr-form__gradient-angle">
              <Slider
                name="gradientAngle"
                :min="0"
                :max="360"
                class="gradient-angle"
                :disabled="$form.gradientType?.value !== 'linear' || loading"
                @slideend="onChange"
              />
              <div
                :class="[
                  'gradient-angle__number p-inputtext p-component p-filled p-inputtext-fluid',
                  $form.gradientType?.value !== 'linear' ? 'p-disabled' : undefined,
                ]"
              >
                {{ $form.gradientAngle?.value }}
              </div>
            </div>
          </div>
        </Fieldset>

        <!-- IMAGE -->
        <Fieldset legend="Image">
          <div class="qr-form__upload">
            <FileUpload
              :key="fileUploadKey"
              name="image"
              mode="basic"
              customUpload
              accept="image/jpeg,image/png,image/svg+xml"
              :maxFileSize="102400"
              @select="onFileSelect"
              @change="onChange"
              :disabled="loading"
            />
            <Button
              v-if="fileUploadFile"
              severity="danger"
              icon="pi pi-trash"
              v-tooltip.top="{ value: 'Remove Image' }"
              style="flex-shrink: 0;"
              @click="() => onFileDelete()"
              :disabled="loading"
            />
          </div>
        </Fieldset>

        <!-- BUTTONS -->
        <div class="qr-form__buttons">
            <Button
              severity="secondary"
              label="cancel"
              fluid
              @click="visible = false"
              :disabled="loading"
            />
            <Button
              type="submit"
              severity="contrast"
              label="Save"
              fluid
              :loading="loading"
            />
        </div>
      </Form>
    </div>
  </div>
</Dialog>
</template>

<style lang="scss" scoped>
.qrcode-preview {
  max-width: 25rem;
  margin-inline: auto;
}
.row {
  display: flex;
  gap: 1.25rem;
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 700px) {
  .row {
    flex-direction: column;
  }
}

label {
  cursor: pointer;
}

.asd {
  margin-block: 0.625rem;
}

.qr-form {
  &__colors {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;

    i {
      margin-left: auto;
    }
  }

  &__gradient {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__gradient-type {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  &__gradient-angle {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  &__upload {
    display: flex;
    align-items: start;
    justify-content: space-between;
  }

  &__buttons {
    display: flex;
    gap: 1.25rem;
    margin-top: 1.25rem;
  }
}

.labeled {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gradient-angle {
  flex: 2;
  margin: 0.6rem;

  &__number {
    width: 4rem;
    text-align: center;
  }
}
</style>
