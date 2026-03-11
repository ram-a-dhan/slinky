export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devServer: {
    host: "dev.slinky.app",
    port: 3000,
  },
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  modules: ["@pinia/nuxt"],
  runtimeConfig: {
    DB_URL: process.env.DB_URL,
    DB_TOKEN: process.env.DB_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  },
})
