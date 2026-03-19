<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms";

interface IFormValues {
  email: string;
}

const visible = defineModel<boolean>("visible", { required: true });

const loading = ref(false);

const auth = useAuthStore();
const toast = useToast();

const resolver: IFormResolver<IFormValues> = ({ values }) => {
  const errors: IFormResolverReturn<IFormValues>["errors"] = { email: [] };
  
  if (!values.email) {
    errors.email.push({ message: "Email is required." });
  }
    
  if (values.email && values.email !== auth.user?.email) {
    errors.email.push({ message: "Input your email." });
  }
  
  return { errors };
};

const onSubmit = async (event: FormSubmitEvent) => {
  if (!event.valid) {
    event.errors.email?.forEach((error: Error) => {
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
      { method: HTTP_METHOD.DELETE },
    );

    if (response.statusCode === HTTP_STATUS.OK) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "We're sorry to see you go. You can join us again anytime.",
        life: 10000,
      });
      visible.value = false;
      auth.signOut();
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
  header="Delete Account"
  style="width: 25rem;"
  modal
>
  <Form
    v-slot="$form"
    :resolver="resolver"
    @submit="onSubmit"
    class="user-form"
  >
    <span>Enter your email address to proceed with deleting your account.</span>
    <span class="user-form__emphasis">{{ auth.user?.email }}</span>
    <div class="user-form__group">
      <label for="email">Email</label>
      <InputText
        fluid
        id="email"
        name="email"
        :disabled="loading"
      />
      <Message
        v-for="error in $form.email?.errors"
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
        severity="danger"
        icon="pi pi-exclamation-triangle"
        label="Delete Account"
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

  &__emphasis {
    display: block;
    font-weight: bold;
    text-align: center;
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
  }
}
</style>