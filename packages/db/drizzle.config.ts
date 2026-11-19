import { defineConfig } from "drizzle-kit"

try {
  process.loadEnvFile("../../.env")
} catch {}

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set (see .env.example)")

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL },
})
