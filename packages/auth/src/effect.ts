import { Context, Effect, Layer, Option, Schema } from "effect"

import { auth, type Session } from "./index"

export class AuthError extends Schema.TaggedError<AuthError>()("AuthError", {
  cause: Schema.Defect(),
}) {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>()("Unauthorized", {}) {}

/** Effect wrapper around the Better Auth server API. */
export class Auth extends Context.Service<
  Auth,
  {
    readonly getSession: (headers: Headers) => Effect.Effect<Option.Option<Session>, AuthError>
    readonly requireSession: (headers: Headers) => Effect.Effect<Session, AuthError | Unauthorized>
  }
>()("@workspace/auth/Auth") {
  static readonly layer = Layer.sync(Auth, () => {
    const getSession = Effect.fn("Auth.getSession")(function* (headers: Headers) {
      const session = yield* Effect.tryPromise({
        try: () => auth.api.getSession({ headers }),
        catch: (cause) => new AuthError({ cause }),
      })
      return Option.fromNullishOr(session)
    })

    const requireSession = Effect.fn("Auth.requireSession")(function* (headers: Headers) {
      const session = yield* getSession(headers)
      if (Option.isNone(session)) return yield* new Unauthorized()
      return session.value
    })

    return Auth.of({ getSession, requireSession })
  })
}
