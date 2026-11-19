import "server-only"

import { Auth } from "@workspace/auth/effect"
import { DatabaseLive } from "@workspace/db"
import { Layer, ManagedRuntime } from "effect"

const AppLayer = Layer.mergeAll(DatabaseLive, Auth.layer)

const make = () => ManagedRuntime.make(Layer.orDie(AppLayer))

// Reuse one runtime (and its pg pool) across hot reloads in dev.
const g = globalThis as { __proplyRuntime?: ReturnType<typeof make> }

export const runtime = (g.__proplyRuntime ??= make())
