import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import { relations } from "./relations"

/**
 * Plain (non-Effect) Drizzle client over node-postgres.
 * Used by libraries that need a promise-based Drizzle instance, e.g. Better Auth.
 * App code should prefer the Effect `Database` service from "@workspace/db".
 */
const g = globalThis as { __proplyPool?: Pool }

export const pool = (g.__proplyPool ??= new Pool({
  connectionString: process.env.DATABASE_URL,
}))

export const db = drizzle({ client: pool, relations })
