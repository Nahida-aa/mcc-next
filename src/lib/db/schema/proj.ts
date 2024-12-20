import { InferSelectModel } from "drizzle-orm";
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { timestamps, uuidCommon } from "./columnsHelpers"

export const proj = pgTable("Proj", {
  ...uuidCommon
}, (table) => [
  // index("ix_Proj_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
  index("ix_Proj_name").on(table.name),
]);