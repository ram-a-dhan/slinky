interface IUseTurnstileOptions {
  turnstileRef?: string;
}

export const useTurnstile = (options?: IUseTurnstileOptions) => {
  const { turnstileRef = "turnstile" } = options || {};

  const turnstile = useTemplateRef<Turnstile.Turnstile>(turnstileRef);
  const turnstileToken = ref<string | undefined>(undefined);
  const turnstileError = ref<string | undefined>(undefined);

  const onTurnstileError = () => {
    turnstileError.value = "Verification failed. Please try again."
    turnstileToken.value = undefined;
  };

  const onTurnstileExpired = () => {
    turnstileError.value = "Verification expired. Please try again."
    turnstileToken.value = undefined;
  };

  const resetTurnstile = () => {
    turnstile.value?.reset();
    turnstileError.value = undefined;
    turnstileToken.value = undefined;
  };

  return {
    turnstile,
    turnstileToken,
    turnstileError,
    onTurnstileError,
    onTurnstileExpired,
    resetTurnstile,
  }
};