import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid } from "drizzle-orm/pg-core"
import { uuidCommon } from "./columnsHelpers";
import { 
  // linkGroupFollow, 
  linkGroupIdentity, linkGroupProj, linkGroupResource } from "./link";
import { follow_table } from "./follow";
import { user as user_table } from "./user";
import { linkUserGroup } from "./linkUserGroup";

export const group = pgTable("Group", {
  ...uuidCommon,
  image: varchar().default("https://avatar.vercel.sh/guest").notNull(),
  nickname: varchar("nickname", { length: 32 }),
  email: varchar('email', { length: 64 }),
  members_count: integer("members_count").default(1).notNull(),
  followers_count: integer("followers_count").default(0).notNull(),
  creator_id: uuid("creator_id").notNull().references(() => user_table.id), // 添加创建者字段
}, (table) => [
  // index("ix_Group_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
  index("ix_Group_name").on(table.name),
]);
export const group_table = group;

export const groupRelations = relations(group, ({many, one }) => ({
  followers: many(follow_table, { // 粉丝
    relationName: "target_group",
  }),
  creator: one(user_table, {
    fields: [group.creator_id],
    references: [user_table.id]
  }),
  members: many(linkUserGroup),
  linkGroupProjs: many(linkGroupProj),
  linkGroupResources: many(linkGroupResource),
  linkGroupIdentities: many(linkGroupIdentity),
}));

export type Group = InferSelectModel<typeof group>;