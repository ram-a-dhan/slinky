<script lang="ts" setup>
import type { FormSubmitEvent } from "@primevue/forms";
import QRCodeStyling from "qr-code-styling";
import { useShortLink } from "~/composables/useShortLink";

interface IFormValues {
  target: string;
}

const cardIndex = ref(0);
const cardSet = ref<HTMLDivElement | null>(null);
const initialValues = ref<IFormValues>({ target: "https://" });
const formKey = ref(0);
const loading = ref(false);

const toast = useToast();

const {
  shortlink,
  renderQRCode,
  downloadQRCode,
  setShortLink,
  copyShortLink,
} = useShortLink({ toast });

const nextCard = () => {
  if (!cardSet.value) return;

  if (cardIndex.value < cardSet.value.children.length - 1) {
    cardSet.value.children[cardIndex.value]?.classList.toggle("card--show");
    cardSet.value.children[cardIndex.value + 1]?.classList.toggle("card--show");
    cardIndex.value++;
  } else {
    cardSet.value.children[cardIndex.value]?.classList.toggle("card--show");
    cardSet.value.children[0]?.classList.toggle("card--show");
    cardIndex.value = 0;
  }
};

const resolver: IFormResolver<IFormValues> = ({ values }) => {
  const errors: IFormResolverReturn<IFormValues>["errors"] = {
    target: [],
  };

  if (!values.target) {
    errors.target.push({ message: "Target URL is required." });
  }

  if (values.target && !REGEX.LINK_TARGET.test(values.target)) {
    errors.target.push({ message: "Target must be valid url that begins with http:// or https:// ." });
  }

  return { errors };
};

const onSubmit = async (event: FormSubmitEvent) => {
  if (!event.valid) {
    event.errors.target?.forEach((error: Error) => {
      toast.add({
        severity: "error",
        summary: "Form Validation",
        detail: error.message,
        life: 3000,
      });
    });
    return;
  }

  try {
    loading.value = true;

    const response = await $fetch<IRes<ILink>>(
      "/api/links",
      {
        method: HTTP_METHOD.POST,
        body: { target: event.states.target?.value },
      }
    );

    setShortLink({ slug: response.data.slug });
    await renderQRCode();

    toast.add({
      severity: "success",
      summary: "Success",
      detail: response.statusMessage,
      life: 3000,
    });
    nextCard();
    initialValues.value = { target: "https://" };
    formKey.value++;
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
</script>

<template>
<div class="card-set" ref="cardSet">

  <!-- BANNER -->

  <div class="card card--banner card--show">
    <div class="card__title">
      <h1>Slinky</h1>
      <p>URL Shortener</p>
    </div>
    <img src="/assets/images/hero.svg" alt="Slinky Hero" class="hero" />
  
    <Button
      severity="contrast"
      fluid
      icon="pi pi-link"
      label="Try It!"
      @click="nextCard"
    />
  </div>

  <!-- CREATE -->
  
  <div class="card card--create">
    <Form
      v-slot="$form"
      :key="formKey"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="onSubmit"
      class="create-form"
    >
    <div class="card__title">
      <h1>Create Link</h1>
    </div>

      <div class="create-form__group">
        <FloatLabel variant="on">
          <InputText id="target" name="target" fluid :disabled="loading" />
          <label for="target">Target URL</label>
        </FloatLabel>
        <Message
          v-for="error in $form.target?.errors"
          severity="error"
          variant="simple"
          size="small"
        >
          {{ error.message }}
        </Message>
      </div>
      
      <Button
        type="submit"  
        severity="contrast"
        fluid
        icon="pi pi-check-circle"
        label="Submit URL"
        :loading="loading"
      />
    </Form>
  </div>

  <!-- RESULT -->
  
  <div class="card card--result">
    <div class="card__title">
      <h1>Result</h1>
    </div>

    <div class="result__qr-code" ref="qrBox" />
    
    <InputGroup>
      <Button
        severity="contrast"
        v-tooltip.top="{ value: 'Download QR Code' }"
        icon="pi pi-download"
        @click="downloadQRCode"
      />
      <InputText
        v-model="shortlink"
        readonly
        fluid
      />
      <Button
        severity="contrast"
        v-tooltip.top="{ value: 'Copy to Clipboard' }"
        icon="pi pi-clipboard"
        @click="copyShortLink"
      />
    </InputGroup>
    
    <Button
      severity="contrast"
      fluid
      icon="pi pi-clone"
      label="Create Another"
      @click="nextCard"
    />
  </div>
</div>
</template>

<style lang="scss" scoped>
.card-set {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 5 / 7;
}

.card {
  position: absolute;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  height: 100%;

  &--show {
    display: flex;
  }

  &__title {
    text-align: center;
  }
}

.hero {
  width: 100%;
  border-radius: var(--p-button-border-radius);
}

.create-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  height: 100%;
}

.result {
  &__qr-code {
    width: 100%;
    aspect-ratio: 1;
    background-color: grey;
    border-radius: var(--p-button-border-radius);

    // Force the rendered svg/canvas to scale with the container.
    :deep(svg),
    :deep(canvas) {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
