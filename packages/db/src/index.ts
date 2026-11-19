import { PgClient } from "@effect/sql-pg"
import * as PgDrizzle from "drizzle-orm/effect-postgres"
import { Config, Context, Effect, Layer } from "effect"

import { relations } from "./relations"
import * as schema from "./schema"

export { relations, schema }
export * from "./schema"

const makeDb = PgDrizzle.makeWithDefaults({ relations })

export class Database extends Context.Service<
  Database,
  Effect.Success<typeof makeDb>
>()("@workspace/db/Database") {
  static readonly layer = Layer.effect(Database, makeDb)
}

export const PgLive = PgClient.layerConfig({
  url: Config.Redacted("DATABASE_URL"),
})

export const DatabaseLive = Database.layer.pipe(Layer.provide(PgLive))
