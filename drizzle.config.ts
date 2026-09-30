import { defineConfig } from "drizzle-kit";

// মাইগ্রেশন কনফিগ — স্কিমা drizzle-schema.ts-ই সত্যের উৎস।
export default defineConfig({
  schema: "./server/db/drizzle-schema.ts",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/meghdut",
  },
});
