import QRCodeStyling from "qr-code-styling";
import type { IQrOptions } from "~~/shared/types/data";

interface IUseLinkOptions {
  toast: ReturnType<typeof useToast>;
  qrRef?: string;
}

export const useShortLink = ({ toast, qrRef = "qrBox" }: IUseLinkOptions) => {
  const shortlink = ref("");
  const qrBox = useTemplateRef<HTMLDivElement>(qrRef);
  const qrCode = ref<QRCodeStyling | null>(null);
  const url = useRuntimeConfig().public.BASE_URL as string;

  const renderQRCode = async (options: Partial<IQrOptions> = {}) => {    
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
        .replace(`${url}/`, "slinky_")
        .replace("/", "_"),
    });
  };

  const setShortLink = ({ slug, username = "go" }: { slug: string, username?: string }) => {
    shortlink.value = [url, username, slug].join("/");
  };

  const copyShortLink = async () => {
    try {
      if (!shortlink.value) return;
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shortlink.value);
      } else {
        // Fallback for HTTP environment.
        const placeholder = document.createElement("textarea");
        placeholder.value = shortlink.value;
        placeholder.style.position = "fixed";
        placeholder.style.opacity = "0";
        document.body.appendChild(placeholder);
        placeholder.select();
        document.execCommand("copy");
        document.body.removeChild(placeholder);
      }
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
    setShortLink,
    copyShortLink,
  };
};