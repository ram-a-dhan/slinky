import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

export const Preset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  "{surface.50}",
      100: "{surface.100}",
      200: "{surface.200}",
      300: "{surface.300}",
      400: "{surface.400}",
      500: "{surface.500}",
      600: "{surface.600}",
      700: "{surface.700}",
      800: "{surface.800}",
      900: "{surface.900}",
      950: "{surface.950}",
    },
    colorScheme: {
      light: {
        primary: {
          color:        "{surface.950}",
          inverseColor: "{surface.0}",
          hoverColor:   "{surface.900}",
          activeColor:  "{surface.800}",
        },
        highlight: {
          background:      "{surface.950}",
          focusBackground: "{surface.700}",
          color:           "#ffffff",
          focusColor:      "#ffffff",
        }
      },
      dark: {
        primary: {
          color:        "{surface.50}",
          inverseColor: "{surface.950}",
          hoverColor:   "{surface.100}",
          activeColor:  "{surface.200}",
        },
        highlight: {
          background:      "rgba(250, 250, 250, .16)",
          focusBackground: "rgba(250, 250, 250, .24)",
          color:           "rgba(255, 255, 255, .87)",
          focusColor:      "rgba(255, 255, 255, .87)",
        }
      }
    }
  }
});

