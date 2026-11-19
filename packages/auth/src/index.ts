import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { db } from "@workspace/db/client"
import * as schema from "@workspace/db/schema"

export const auth = betterAuth({
  appName: "proplycrm",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  // Must stay last: lets server actions set auth cookies.
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
