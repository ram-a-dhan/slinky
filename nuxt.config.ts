export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    host: "dev.slinky.app",
    port: 3000,
  },
  future: {
    compatibilityVersion: 4
  },
  runtimeConfig: {
    DB_URL: process.env.DB_URL,
    DB_TOKEN: process.env.DB_TOKEN,
  },
})
