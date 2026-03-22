import QRCodeStyling from "qr-code-styling";

interface IUseLinkOptions {
  url: ReturnType<typeof useRequestURL>;
  toast: ReturnType<typeof useToast>;
  qrRef?: string;
}

export const useShortLink = ({ url, toast, qrRef = "qrBox" }: IUseLinkOptions) => {
  const shortlink = ref("");
  const qrBox = useTemplateRef<HTMLDivElement>(qrRef);
  const qrCode = ref<QRCodeStyling | null>(null);

  const renderQRCode = async (options: IQrCodeOptions = {}) => {
    if (!shortlink.value || !qrBox.value) return;

    await nextTick();

    qrCode.value = new QRCodeStyling({
      data: shortlink.value,
      ...qrCodeOptions(options),
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

  const copyShortLink = async () => {
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

  return {
    shortlink,
    qrBox,
    qrCode,
    renderQRCode,
    downloadQRCode,
    copyShortLink,
  };
};