import slinky from "~/assets/images/slinky.png";
import type { Options } from "qr-code-styling";

export interface IQrCodeOptions {
  image?: string;
  color1?: string;
  color2?: string;
}

export const qrCodeOptions = ({
  image = slinky,
  color1 = "#00cc76",
  color2 = "#90e36a",
}: IQrCodeOptions = {}): Options => {
  return {
    type: "canvas",
    shape: "square",
    width: 400,
    height: 400,
    image,
    imageOptions: {
      saveAsBlob: true,
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 0,
    },
    dotsOptions: {
      type: "extra-rounded",
      roundSize: true,
      gradient: {
        type: "linear",
        rotation: 0,
        colorStops: [
          {
            offset: 0,
            color: color1,
          },
          {
            offset: 1,
            color: color2,
          },
        ],
      },
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#000000",
    },
    cornersDotOptions: {
      color: "#000000",
    },
  };
};