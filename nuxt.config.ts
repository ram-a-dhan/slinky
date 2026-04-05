import { Preset } from "./primevue.config";

export default defineNuxtConfig({
  site: {
    url: process.env.BASE_URL,
    name: "Slinky - URL Shortener",
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
        preset: Preset,
        options: {
          darkModeSelector: "system",
          cssLayer: false,
        },
      },
    },
  },
  turnstile: { siteKey: process.env.TURNSTILE_SITE_KEY },
  runtimeConfig: {
    TURSO_DB_URL: process.env.TURSO_DB_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    GOOGLE_SAFE_BROWSING_API_KEY: process.env.GOOGLE_SAFE_BROWSING_API_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    public: {
      BASE_URL: process.env.BASE_URL,
    },
  },
})
