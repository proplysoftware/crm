"use client"

import { useRouter } from "next/navigation"

import { authClient } from "@workspace/auth/client"

import { SignUp } from "@/components/sign-up"

export default function SignUpPage() {
  const router = useRouter()

  return (
    <SignUp
      className="h-svh"
      onSignUp={async ({ name, email, password }) => {
        const { error } = await authClient.signUp.email({ name, email, password })
        if (error) return { ok: false, error: error.message ?? "Couldn’t create your account." }
        router.replace("/")
        router.refresh()
        return { ok: true }
      }}
      onSignIn={() => router.push("/sign-in")}
    />
  )
}
