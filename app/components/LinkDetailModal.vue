<script lang="ts" setup>
import type { FormSubmitEvent } from "@primevue/forms";

interface IProps {
  linkId?: string;
  refresh: Function;
}

interface IFormValues {
  slug: string;
  target: string;
}

const visible = defineModel<boolean>("visible", { required: true });
const props = defineProps<IProps>();
  
const loading = ref(false);
const loadingDelete = ref(false);
const header = ref("");
const initialValues = ref<IFormValues>({
  slug: "",
  target: "https://" ,
});
const formKey = ref(0);
const slug = ref<string>("");

const auth = useAuthStore();
const confirm = useConfirm();
const toast = useToast();
const url = useRequestURL();

watch(visible, async (val) => {
  if (val === true) {
    if (props.linkId) {
      header.value = "Edit Link";

      const response = await fetchDetail(props.linkId);

      initialValues.value = {
        slug: response?.data.slug || "",
        target: response?.data.target || "",
      };
      slug.value = response?.data.slug || "";
    } else {
      header.value = "Create Link";

      initialValues.value = {
        slug: "",
        target: "https://",
      };
      slug.value = "";
    }
    formKey.value++;
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

const resolver: IFormResolver<IFormValues> = ({ values }) => {
  const errors: IFormResolverReturn<IFormValues>["errors"] = {
    slug: [],
    target: [],
  };

  if (!values.slug) {
    errors.slug.push({ message: "Slug is required." });
  }

  if (values.slug && !REGEX.LINK_SLUG.test(values.slug)) {
    errors.slug.push({ message: "Slug must be 8 or more alphanumeric, underscore, or hyphen characters." });
  }

  if (!values.target) {
    errors.target.push({ message: "Target is required." });
  }

  if (values.target && !REGEX.LINK_TARGET.test(values.target)) {
    errors.target.push({ message: "Target must be valid url that begins with http:// or https:// ." });
  }

  return { errors };
};

const onSubmit = async (event: FormSubmitEvent) => {
  if (!event.valid) {
    event.errors.slug?.forEach((error: Error) => {
      toast.add({
        severity: "error",
        summary: "Form Validation",
        detail: error.message,
        life: 3000,
      });
    });
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

    const endpoint = props.linkId
      ? `/api/links/${props.linkId}`
      : "/api/links";

    const method = props.linkId
      ? HTTP_METHOD.PATCH
      : HTTP_METHOD.POST;      

    const response = await $fetch<IRes<ILink>>(
      endpoint,
      {
        method,
        body: {
          slug: event.states.slug?.value,
          target: event.states.target?.value,
          userId: auth.user?.id,
        },
      }
    );

    if (response.statusCode === HTTP_STATUS.OK || response.statusCode === HTTP_STATUS.CREATED) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: response.statusMessage,
        life: 3000,
      });
      await props.refresh();
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

const onClickDelete = () => {
  confirm.require({
    header: "Delete Link",
    icon: "pi pi-exclamation-triangle",
    message: "Are you sure you want to delete this link?",
    accept: onConfirmDelete,
    acceptProps: {
      severity: "danger",
      icon: "pi pi-exclamation-triangle",
      label: "Delete Link",
    },
    rejectProps: {
      severity: "secondary",
      label: "Cancel",
    },
  });
};

const onConfirmDelete = async () => {
  try {
    loadingDelete.value = true;

    const response = await $fetch<IRes>(
      `/api/links/${props.linkId}`,
      { method: HTTP_METHOD.DELETE },
    );

    if (response.statusCode === HTTP_STATUS.OK) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: response.statusMessage,
        life: 3000,
      });
      props.refresh();
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
    loadingDelete.value = false;
  }
};
</script>

<template>
<Dialog
  v-model:visible="visible"
  :header="header"
  style="width: 25rem;"
  modal
>
  <Form
    v-slot="$form"
    :key="formKey"
    :initialValues="initialValues"
    :resolver="resolver"
    @submit="onSubmit"
    class="link-form"
  >
    <p>Your shortlink would look like this:</p>
    <p class="link-form__preview">
      {{ url.origin }}/{{ auth.user?.username }}/{{slug.length >= 8 ? slug : "your-slug"}}
    </p>

    <div class="link-form__group">
      <label for="slug">Slug</label>
      <InputText
        fluid
        id="slug"
        name="slug"
        v-model="slug"
        :disabled="loading || loadingDelete"
      />
      <Message
        v-for="error in $form.slug?.errors"
        severity="error"
        variant="simple"
        size="small"
      >
        {{ error.message }}
      </Message>
    </div>

    <div class="link-form__group">
      <label for="target">Target</label>
      <InputText
        fluid
        id="target"
        name="target"
        :disabled="loading || loadingDelete"
      />
      <Message
        v-for="error in $form.target?.errors"
        severity="error"
        variant="simple"
        size="small"
      >
        {{ error.message }}
      </Message>
    </div>

    <div class="link-form__buttons">
      <Button
        v-if="props.linkId"
        severity="danger"
        icon="pi pi-trash"
        class="link-delete"
        v-tooltip.top="{ value: 'Delete Link' }"
        @click="onClickDelete"
        :loading="loadingDelete"
      />
      <Button
        severity="secondary"
        label="Cancel"
        @click="visible = false"
        :disabled="loading || loadingDelete"
      />
      <Button
        type="submit"
        severity="contrast"
        :label="header"
        :loading="loading"
        :disabled="loadingDelete"
      />
    </div>
  </Form>
</Dialog>
</template>

<style lang="scss" scoped>
.link-form {
  display: flex;
  flex-direction: column;
  gap: 2.50rem;

  &__preview {
    text-align: center;
    word-wrap: break-word;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__buttons {
    display: flex;
    justify-content: end;
    gap: 1.25rem;

    .link-delete {
      margin-right: auto;
    }
  }
}
</style>
