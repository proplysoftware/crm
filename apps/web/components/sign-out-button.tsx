"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { authClient } from "@workspace/auth/client"
import { Button } from "@workspace/ui/components/button"

export function SignOutButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  return (
    <Button
      loading={busy}
      onClick={async () => {
        setBusy(true)
        await authClient.signOut()
        router.replace("/sign-in")
        router.refresh()
      }}
      variant="outline"
    >
      Sign out
    </Button>
  )
}
