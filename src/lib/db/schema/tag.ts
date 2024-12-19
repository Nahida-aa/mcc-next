import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid } from "drizzle-orm/pg-core"

export const tag = pgTable("Tag", {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar().notNull(),
  description: varchar(),
}, (table) => [
  uniqueIndex("ix_Tag_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);