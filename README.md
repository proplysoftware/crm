# proplycrm

Turborepo · pnpm 12 · Next.js 16 · Effect v4 · Drizzle ORM (1.0 rc, Effect driver) · Postgres · Better Auth · devl / coss ui

```
apps/web                 Next.js app (Effect ManagedRuntime in lib/runtime.ts)
packages/auth            Better Auth server config, React client, Effect `Auth` service
packages/db              Drizzle schema (app + auth tables) + Effect `Database` service/layer
packages/ui              coss ui primitives + theme from devl.dev
packages/eslint-config
packages/typescript-config
```

## Setup

```sh
pnpm install
cp .env.example .env      # then set BETTER_AUTH_SECRET (openssl rand -base64 32)
docker compose up -d      # Postgres on localhost:5433
pnpm db:migrate
pnpm dev
```

## Database

- Edit `packages/db/src/schema.ts`, then `pnpm db:generate` and `pnpm db:migrate`.
- In Effect code: `const db = yield* Database` and query with Drizzle (`yield* db.select().from(contacts)`).
- In Next server components: `await runtime.runPromise(effect)` (see `apps/web/app/page.tsx`).

## Auth (Better Auth)

- Email + password is enabled in `packages/auth/src/index.ts` (Drizzle adapter, `nextCookies` plugin).
- Handler: `apps/web/app/api/auth/[...all]/route.ts`. Pages: `/sign-in`, `/sign-up` (devl screens).
- `apps/web/proxy.ts` does a fast cookie check and redirects; pages verify the session on the server.
- Server (Effect): `const session = yield* (yield* Auth).requireSession(headers)`, which fails with `Unauthorized`.
- Client: `import { authClient } from "@workspace/auth/client"`.
- Adding plugins or fields: edit the config, then `pnpm --filter @workspace/auth auth:generate`, `pnpm db:generate`, `pnpm db:migrate`.

## UI (devl.dev)

`packages/ui` holds the coss ui primitives and theme from [devl.dev](https://devl.dev) (MIT, see `packages/ui/LICENSE.devl`).
Add any devl component from `apps/web`:

```sh
cd apps/web
pnpm dlx shadcn@latest add @devl/<slug>     # e.g. @devl/liquid-switch, @devl/sign-in
```

It lands in `apps/web/components/<slug>.tsx`. coss primitives come from `@coss/*` and go into `packages/ui`.
Browse: https://devl.dev/components, /blocks, /screens, /motion, /illustrations.

## Code review

Pull requests get AI code review from [PR-Agent](https://github.com/The-PR-Agent/pr-agent) running OpenAI GPT-6.2 Sol (`.github/workflows/pr-agent.yml`, needs the `OPENAI_KEY` repo secret). Review instructions are in `.pr_agent.toml`. Comment `/review`, `/improve`, `/describe` or `/ask "..."` on a PR to rerun it.
