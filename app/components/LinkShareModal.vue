<script lang="ts" setup>
import QRCodeStyling from "qr-code-styling";

interface IProps {
  linkId?: string;
}

const visible = defineModel<boolean>("visible", { required: true });
const props = defineProps<IProps>();

const loading = ref(false);
const shortlink = ref("");
const qrBox = ref<HTMLDivElement | null>(null);
const qrCode = ref<QRCodeStyling | null>(null);

const auth = useAuthStore();
const toast = useToast();
const url = useRequestURL();

watch(visible, async (val) => {
  if (val === true && props.linkId) {
    const response = await fetchDetail(props.linkId);
    
    shortlink.value = `${url.origin}/${auth.user?.username}/${response?.data.slug}`;

    await nextTick();
    renderQRCode();
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

const renderQRCode = () => {
  if (!shortlink.value || !qrBox.value) return;

  qrCode.value = new QRCodeStyling({
    width: 400,
    height: 400,
    data: shortlink.value,
  });
  qrBox.value.innerHTML = "";
  qrCode.value.append(qrBox.value);
};

const downloadQRCode = () => {
  if (!shortlink.value || !qrCode.value) return;

  qrCode.value.download({
    extension: "png",
    name: shortlink.value
      .replace(`${url.origin}/`, "slinky_")
      .replace("/", "_"),
  });
};

const copyShortlink = async () => {
  try {
    if (!shortlink.value) return;
    await navigator.clipboard.writeText(shortlink.value);
    toast.add({
      severity: "success",
      summary: "Copy Success",
      detail: "Shortlink copied to clipboard.",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Copy Error",
      detail: (error as Error).message,
      life: 3000,
    });
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
        @click="copyShortlink"
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
