import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  hitCount: integer("hit_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  lastAccessedAt: integer("last_accessed_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const qrOptions = sqliteTable("qr_options", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  style: text("style"),
  color1: text("color1"),
  color2: text("color2"),
  invert: integer("invert", { mode: "boolean" }),
  gradientType: text("gradient_type"),
  gradientAngle: integer("gradient_angle"),
  imageUrl: text("image_url"),
  userId: text("user_id").notNull().unique().references(() => users.id),
});

export const links = sqliteTable("links", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  target: text("target").notNull(),
  userId: text("user_id").references(() => users.id),
  hitCount: integer("hit_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  lastAccessedAt: integer("last_accessed_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const rateLimits = sqliteTable("rate_limits", {
  ip: text("ip").primaryKey(),
  count: integer("count").notNull().default(1),
  resetAt: integer("reset_at", { mode: "timestamp_ms" }).notNull(),
});