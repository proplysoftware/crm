"use client"

import { useRouter } from "next/navigation"

import { authClient } from "@workspace/auth/client"

import { SignIn } from "@/components/sign-in"

export default function SignInPage() {
  const router = useRouter()

  return (
    <SignIn
      className="h-svh"
      onSignIn={async (email, password) => {
        const { error } = await authClient.signIn.email({ email, password })
        if (error) return { ok: false, error: error.message ?? "Couldn’t sign you in." }
        router.replace("/")
        router.refresh()
        return { ok: true }
      }}
      onSignUp={() => router.push("/sign-up")}
    />
  )
}
