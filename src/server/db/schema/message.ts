import { relations, type InferSelectModel } from 'drizzle-orm';
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid, json, jsonb } from "drizzle-orm/pg-core"
import { timestamps, uuidCommon } from "./columnsHelpers"
import { user_table } from "./user";
import { group_table } from "./group";

export const message_table = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chat_id: uuid("chat_id").notNull().references(() => chat_table.id),
  sender_id: uuid("sender_id").notNull().references(() => user_table.id),
  content: varchar("content", { length: 256 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const messageRelations = relations(message_table, ({ one }) => ({
  chat: one(chat_table, {
    fields: [message_table.chat_id],
    references: [chat_table.id]
  }),
  sender: one(user_table, {
    fields: [message_table.sender_id],
    references: [user_table.id]
  }),
}));

export const chat_table = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => user_table.id),
  target_id: uuid("target_id").notNull(),
  target_type: varchar("target_type", { length: 16 }).notNull(), // 'user' or 'group'
  is_pinned: boolean("is_pinned").default(false).notNull(), // 顶置状态
  is_read: boolean("is_read").default(false).notNull(), // 已读状态
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("Chat_unique").on(table.user_id, table.target_id, table.target_type),
]);

export const chatRelations = relations(chat_table, ({ one }) => ({
  user: one(user_table, {
    fields: [chat_table.user_id],
    references: [user_table.id]
  }),
  target_user: one(user_table, {
    fields: [chat_table.target_id],
    references: [user_table.id],
    relationName: 'target_user',
  }),
  target_group: one(group_table, {
    fields: [chat_table.target_id],
    references: [group_table.id],
    relationName: 'target_group',
  }),
}));