import { createAuthClient } from "better-auth/react"

// Same-origin by default; set baseURL if the auth API lives elsewhere.
export const authClient = createAuthClient()

export const { signIn, signUp, signOut, useSession } = authClient
