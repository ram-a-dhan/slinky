import type { FormInstance } from "@primevue/forms";

export const extractFormData = (form: IFormSlot | FormInstance["states"]) => {
  return Object
    .entries(form)
    .map(([key, state]) => [key, state.value])
    .reduce((a, b) => {
      a[b[0]] = b[1];
      return a;
    }, {} as Record<string, any>);
};
