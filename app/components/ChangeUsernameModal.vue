<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms";

interface IFormValues {
  username: string;
}

const visible = defineModel<boolean>("visible", { required: true });

const loading = ref(false);
const initialValues = ref<IFormValues>({ username: "" });
const formKey = ref(0);

const auth = useAuthStore();
const toast = useToast();

watch(visible, (val) => {
  if (val === true) {
    initialValues.value.username = auth.user?.username || "";
    formKey.value++;
  }
});

const resolver: IFormResolver<IFormValues> = ({ values }) => {
  const errors: IFormResolverReturn<IFormValues>["errors"] = { username: [] };

  if (!values.username) {
    errors.username.push({ message: "Username is required." });
  }

  if (values.username && !REGEX.USERNAME.test(values.username)) {
    errors.username.push({ message: "Username must be 8-16 alphanumeric characters." });
  }

  return { errors };
};

const onSubmit = async (event: FormSubmitEvent) => {
  if (!event.valid) {
    event.errors.username?.forEach((error: Error) => {
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

    const response = await $fetch<IRes<IUser>>(
      `/api/users/${auth.user?.id}`,
      {
        method: HTTP_METHOD.PATCH,
        body: { username: event.states.username?.value }
      },
    );

    if (response.statusCode === HTTP_STATUS.OK) {
      await auth.fetchUser();
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
</script>

<template>
<Dialog
  v-model:visible="visible"
  header="Change Username"
  style="width: 25rem;"
  modal
>
  <Form
    v-slot="$form"
    :key="formKey"
    :initialValues="initialValues"
    :resolver="resolver"
    @submit="onSubmit"
    class="user-form"
  >
    <span>Your username will be part of all of your shortlinks so make it catchy!</span>

    <div class="user-form__group">
      <label for="username">Username</label>
      <InputText
        fluid
        id="username"
        name="username"
        :disabled="loading"
      />
      <Message
        v-for="error in $form.username?.errors"
        severity="error"
        variant="simple"
        size="small"
      >
        {{ error.message }}
      </Message>
    </div>

    <div class="user-form__buttons">
      <Button
        severity="secondary"
        label="Cancel"
        @click="visible = false"
        :disabled="loading"
      />
      <Button
        type="submit"
        severity="contrast"
        label="Change Username"
        :loading="loading"
      />
    </div>
  </Form>
</Dialog>
</template>

<style scoped lang="scss">
.user-form {
  display: flex;
  flex-direction: column;
  gap: 2.50rem;

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__buttons {
    display: flex;
    justify-content: end;
    gap: 1.25rem;
  }
}
</style>