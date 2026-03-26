import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  site: {
    url: process.env.BASE_URL,
    name: "Fast & Free URL Shortener",
    description: "Shorten long URLs in one click, generate QR codes, with style!",
    defaultLocale: "en",
  },
  sitemap: {
    exclude: [
      "/dashboard/**",
      "/manage-links/**",
      "/api/**",
    ],
  },
  robots: {
    allow: ["/"],
    disallow: [
      "/dashboard",
      "/manage-links",
      "/api",
    ],
  },
  routeRules: {
    "/": { prerender: true },
  },
  compatibilityDate: "2025-07-15",
  css: [
    "~/assets/scss/main.scss",
    "primeicons/primeicons.css",
  ],
  devServer: {
    host: "dev.slin.ky",
    port: 3000,
  },
  devtools: { enabled: false },
  future: { compatibilityVersion: 4 },
  modules: [
    "@pinia/nuxt",
    "@primevue/nuxt-module",
    "@nuxtjs/turnstile",
    "@nuxtjs/seo",
    "nuxt-schema-org",
  ],
  primevue: {
    autoImport: true,
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: "system",
          cssLayer: false,
        },
      },
    },
  },
  turnstile: { siteKey: process.env.TURNSTILE_SITE_KEY },
  runtimeConfig: {
    DB_URL: process.env.DB_URL,
    DB_TOKEN: process.env.DB_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    public: {
      BASE_URL: process.env.BASE_URL,
    },
  },
})
