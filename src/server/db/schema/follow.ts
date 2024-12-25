import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations"
import { user as user_table } from "./user";
import { group as group_table } from "./group";

export const follow_table = pgTable('Follow', {
  follower_id: uuid('follower_id').notNull().references(() => user_table.id),
  target_id: uuid('target_id').notNull(),
  target_type: varchar('target_type', { length: 16 }).notNull(), // 'user' or 'group'
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  primaryKey({columns: [table.follower_id, table.target_id], name: "Follow_pk"}),
  index('Follow_created_at_idx').on(table.created_at),
]);

export const followRelations = relations(follow_table, ({ one }) => ({
  follower: one(user_table, {
    fields: [follow_table.follower_id],
    references: [user_table.id],
    relationName: 'follower',
  }),
  target_user: one(user_table, {
    fields: [follow_table.target_id],
    references: [user_table.id],
    relationName: 'target_user',
  }),
  target_group: one(group_table, {
    fields: [follow_table.target_id],
    references: [group_table.id],
    relationName: 'target_group',
  }),
}));