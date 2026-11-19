import type { NextConfig } from "next"

// One .env at the repo root, shared with drizzle-kit.
try {
  process.loadEnvFile("../../.env")
} catch {}

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/db"],
}

export default nextConfig
