import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DB_URL!,
    authToken: process.env.DB_TOKEN || undefined,
  },
});