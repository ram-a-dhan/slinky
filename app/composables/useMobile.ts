export const useMobile = (breakpoint: number) => {
  const width = ref(breakpoint);

  const handleWidth = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    handleWidth();
    window.addEventListener("resize", handleWidth);
  })

  onUnmounted(() => {
    window.removeEventListener("resize", handleWidth);
  })

  const isMobile = computed(() => width.value < breakpoint);

  return {
    width,
    isMobile,
  }
};