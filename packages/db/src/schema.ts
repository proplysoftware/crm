import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const contacts = pgTable("contacts", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().unique(),
  company: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert

export * from "./auth-schema"
