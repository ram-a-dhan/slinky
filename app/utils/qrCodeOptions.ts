import slinky from "~/assets/images/slinky.png";
import type { CornerDotType, CornerSquareType, DotType, GradientType, Options } from "qr-code-styling";
import type { IQrOptions } from "~~/shared/types/data";

interface IStyle {
  rounded: IStyleConfig;
  circles: IStyleConfig;
  diamond: IStyleConfig;
}

interface IStyleConfig {
  dots: DotType;
  cornerSquare: CornerSquareType;
  cornerDot: CornerDotType;
}

export const qrCodeOptions = ({
  style = "rounded",
  color1 = "#000000",
  color2 = "#000000",
  gradientType = "linear",
  gradientAngle = 0,
  imageUrl = slinky,
}: Partial<IQrOptions> = {}): Options => {
  const styleOptions: IStyle = {
    rounded: {
      dots: "extra-rounded",
      cornerSquare: "extra-rounded",
      cornerDot: "extra-rounded",
    },
    circles: {
      dots: "dots",
      cornerSquare: "dot",
      cornerDot: "dot",
    },
    diamond: {
      dots: "classy-rounded",
      cornerSquare: "classy-rounded",
      cornerDot: "classy-rounded",
    },
  };

  return {
    type: "canvas",
    shape: "square",
    width: 800,
    height: 800,
    image: imageUrl || slinky,
    imageOptions: {
      saveAsBlob: true,
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 0,
    },
    dotsOptions: {
      type: styleOptions[style].dots,
      roundSize: true,
      gradient: {
        type: gradientType,
        rotation: gradientAngle,
        colorStops: [
          {
            offset: 0,
            color: color1.startsWith("#") ? color1 : `#${color1}`,
          },
          {
            offset: 1,
            color: color2.startsWith("#") ? color2 : `#${color2}`,
          },
        ],
      },
    },
    cornersSquareOptions: {
      type: styleOptions[style].cornerSquare,
      color: "#000000",
    },
    cornersDotOptions: {
      type: styleOptions[style].cornerDot,
      color: "#000000",
    },
  };
};