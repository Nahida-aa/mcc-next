import { InferSelectModel } from "drizzle-orm";
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { timestamps, uuidCommon } from "./columnsHelpers"

export const resource = pgTable("Resource", {
  ...uuidCommon,
}, (table) => [
  // index("ix_Resource_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
  index("ix_Resource_name").on(table.name),
]);