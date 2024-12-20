import { InferSelectModel } from "drizzle-orm";
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { uuidCommon } from "./columnsHelpers";

export const group = pgTable("Group", {
  ...uuidCommon,
  followersCount: integer("followers_count").default(0).notNull(),
}, (table) => [
  // index("ix_Group_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
  index("ix_Group_name").on(table.name),
]);

export type Group = InferSelectModel<typeof group>;