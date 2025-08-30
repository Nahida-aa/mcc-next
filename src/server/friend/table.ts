import { foreignKey, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { uuidWithTimestamps } from "../admin/db/columnsHelpers";
import { user } from "../admin/db/schema";

export const follow = pgTable("follow", {
  ...uuidWithTimestamps,
  followerId: text("follower_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  targetId: text("target_id").notNull(),
}, (table) => [
  uniqueIndex("follow_unique_follower_target_idx").using("btree", table.followerId.asc().nullsLast().op("text_ops"), table.targetId.asc().nullsLast().op("text_ops")),
  foreignKey({
      columns: [table.targetId],
      foreignColumns: [user.id],
      name: "follow_target_id_user_id_fk"
    }).onDelete("cascade"),
]);

export const friend = pgTable("friend", {
  ...uuidWithTimestamps,
  user1Id: text("user1_id").notNull(),
  user2Id: text("user2_id").notNull(),
  status: text().default('pending').notNull(),
  reason: text().default('manual_request').notNull(),
}, (table) => [
  uniqueIndex("friend_unique_user1_user2_idx").using("btree", table.user1Id.asc().nullsLast().op("text_ops"), table.user2Id.asc().nullsLast().op("text_ops")),
  foreignKey({
      columns: [table.user1Id],
      foreignColumns: [user.id],
      name: "friend_user1_id_user_id_fk"
    }).onDelete("cascade"),
  foreignKey({
      columns: [table.user2Id],
      foreignColumns: [user.id],
      name: "friend_user2_id_user_id_fk"
    }).onDelete("cascade"),
]);