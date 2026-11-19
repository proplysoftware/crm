import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { desc } from "drizzle-orm"
import { Effect } from "effect"

import { Auth } from "@workspace/auth/effect"
import { contacts, Database } from "@workspace/db"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { SignOutButton } from "@/components/sign-out-button"
import { runtime } from "@/lib/runtime"

const listContacts = Effect.gen(function* () {
  const db = yield* Database
  return yield* db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(50)
}).pipe(Effect.withSpan("listContacts"))

async function ContactsTable() {
  await connection()
  const rows = await runtime.runPromise(listContacts)

  if (rows.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No contacts yet</EmptyTitle>
          <EmptyDescription>Contacts you add will show up here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Company</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell>{c.email ?? "—"}</TableCell>
            <TableCell>
              {c.company ? <Badge variant="outline">{c.company}</Badge> : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

async function Account() {
  const requestHeaders = await headers()
  const session = await runtime.runPromise(
    Effect.gen(function* () {
      const auth = yield* Auth
      return yield* auth.requireSession(requestHeaders)
    }).pipe(Effect.catchTag("Unauthorized", () => Effect.succeed(null))),
  )
  if (!session) redirect("/sign-in")

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        Signed in as <span className="font-medium text-foreground">{session.user.name}</span> ({session.user.email})
      </p>
      <SignOutButton />
    </div>
  )
}

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh max-w-4xl flex-col gap-6 p-6">
      <Suspense fallback={null}>
        <Account />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <CardDescription>Effect v4 + Drizzle + Postgres, rendered with devl / coss ui.</CardDescription>
        </CardHeader>
        <CardPanel>
          <Suspense fallback={<p className="text-muted-foreground text-sm">Loading…</p>}>
            <ContactsTable />
          </Suspense>
        </CardPanel>
      </Card>
      <div>
        <Button variant="outline">Add contact</Button>
      </div>
    </main>
  )
}
