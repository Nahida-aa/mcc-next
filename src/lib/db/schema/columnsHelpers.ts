// src/lib/db/schema/columnsHelpers.ts
import { serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const timestamps = {
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
  created_at: timestamp("created_at").defaultNow().notNull(),
  // deletedAt: timestamp("deleted_at"),
}

export const timestamps_with_deleted_at = {
  ...timestamps,
  deleted_at: timestamp("deleted_at"),
}

export const commonColumns = {
  name: varchar({ length: 32 }).notNull(),
  description: text(),
  ...timestamps
}

export const commonColumnsWithDeletedAt = {
}

export const autoIncrementCommon = {
  id: serial().primaryKey().notNull(),
  ...commonColumns
}

export const uuidCommon = {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  ...commonColumns
}

export const autoIncrementWithTimestamps = {
  id: serial().primaryKey().notNull(),
  ...timestamps
}

export const uuidWithTimestamps = {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  ...timestamps
}