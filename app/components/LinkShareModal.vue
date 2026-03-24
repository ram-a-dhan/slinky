<script lang="ts" setup>
import QRCodeStyling from "qr-code-styling";

interface IProps {
  linkId?: string;
}

const visible = defineModel<boolean>("visible", { required: true });
const props = defineProps<IProps>();

const loading = ref(false);

const auth = useAuthStore();
const toast = useToast();

const {
  shortlink,
  renderQRCode,
  downloadQRCode,
  setShortLink,
  copyShortLink,
} = useShortLink({
  toast,
});

watch(visible, async (val) => {
  if (val === true && props.linkId) {
    const response = await fetchDetail(props.linkId);

    setShortLink({
      slug: response?.data.slug!,
      username: auth.user?.username!,
    })
    await renderQRCode();
  }
});

const fetchDetail = async (id: string) => {
  try {
    loading.value = true;

    return await $fetch<IRes<ILink>>(`/api/links/${id}`);
  } catch (error) {
    const { statusMessage } = error as IRes || {};
    const { message } = error as Error || {};
    toast.add({
      severity: "error",
      summary: "Error",
      detail: statusMessage || message,
      life: 3000,
    });
    visible.value = false;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
<Dialog
  v-model:visible="visible"
  header="Share Link"
  style="width: 25rem;"
  modal
>
  <div class="link-share">
    <div class="link-share__qr-code" ref="qrBox" />

    <Button
      severity="contrast"
      icon="pi pi-download"
      label="Download"
      fluid
      @click="downloadQRCode"
      :disabled="loading"
    />
  
    <InputGroup>
      <InputText
        v-model="shortlink"
        readonly
        fluid
        :disabled="loading"
      />
      <Button
        severity="contrast"
        v-tooltip.top="{ value: 'Copy to Clipboard' }"
        icon="pi pi-clipboard"
        @click="copyShortLink"
        :disabled="loading"
      />
    </InputGroup>
  </div>
</Dialog>
</template>

<style lang="scss" scoped>
.link-share {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &__qr-code {
    width: 100%;
    aspect-ratio: 1;
    background-color: grey;

    // Force the rendered svg/canvas to scale with the container.
    :deep(svg),
    :deep(canvas) {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
