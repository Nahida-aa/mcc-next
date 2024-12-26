import { relations, type InferSelectModel } from 'drizzle-orm';
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid, json, jsonb } from "drizzle-orm/pg-core"
import { timestamps, uuidCommon } from "./columnsHelpers"
import { linkGroupFollow, linkUserFollow, linkUserIdentity, linkUserProj, linkUserResource } from './link';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from '@hono/zod-openapi';
import { follow_table } from './follow';
import { linkUserGroup } from './linkUserGroup';

const platform_info_default = {
  start_year: null as number | null, // > 2009, 第一次玩 mc 的年份
  play_reason: '', // 游戏原因
  server_type: [] as string[],  // 服务器类型: 服务器玩家 | 公益服 | 盈利服 | 多人竞技服 | 多人合作服
  favorite_content: [] as string[], // 喜欢哪些内容: 建筑|生存|冒险|科技
  desired_partners: [] as string[], // 想在平台内结识怎样的伙伴
}
type PlatformInfo = typeof platform_info_default;

export const user = pgTable("User", {
  ...uuidCommon,
  password: varchar("password", { length: 64 }),
  image: varchar(), // ?
  nickname: varchar("nickname", { length: 32 }),
  email: varchar('email', { length: 64 }),
  phone: varchar("phone", { length: 64 }), // 逻辑必填
  gender: varchar(),
  age: integer(),
  lastLogin: timestamp("last_login"),
  followers_count: integer("followers_count").default(0).notNull(), // 粉丝数
  following_count: integer("following_count").default(0).notNull(), // 关注数(包括团队)
  is_superuser: boolean("is_superuser").default(false).notNull(),
  is_staff: boolean("is_staff").default(false).notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  platform_info: jsonb("platform_info").$type<PlatformInfo>().default(platform_info_default),
}, (table) => [
  // index("ix_User_age").using("btree", table.age.asc().nullsLast().op("int4_ops")),
  index("ix_User_age").on(table.age),
  // uniqueIndex("ix_User_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
  uniqueIndex("ix_User_email").on(table.email),
  // uniqueIndex("ix_User_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
  uniqueIndex("ix_User_name").on(table.name),
  uniqueIndex("ix_User_phone").on(table.phone),
]);

export type User = InferSelectModel<typeof user>;

export const idCardInfo = pgTable("IDCardInfo", {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	user_id: uuid("user_id"),
	id_card_number: varchar("id_card_number"), // 身份证号 ? 逻辑必填
	id_card_holder: varchar("id_card_holder").default("self").notNull(), // 身份证持有人 自己:self | 监护人:guardian 
	is_real_name: boolean("is_real_name"),
	front_image_url: varchar("front_image_url"),
	back_image_url: varchar("back_image_url"),
}, (table) => [
	// uniqueIndex("ix_IDCardInfo_id_card_number").using("btree", table.idCardNumber.asc().nullsLast().op("text_ops")),
	uniqueIndex("ix_IDCardInfo_id_card_number").on(table.id_card_number),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [user.id],
			name: "IDCardInfo_user_id_fkey"
		}),
]);

export const userRelations = relations(user, ({one, many}) => ({
  home: one(home),
  id_card_info: one(idCardInfo),
  followings: many(follow_table, { // 关注的 people(user, group)
    relationName: "target_user",
  }),
  followers: many(follow_table, { // 粉丝们
    relationName: "follower",
  }),
  joined_groups: many(linkUserGroup),
  linkUserProjs: many(linkUserProj),
  linkUserResources: many(linkUserResource),
  linkUserIdentities: many(linkUserIdentity),
}));

export const idCardInfoRelations = relations(idCardInfo, ({one}) => ({
  user: one(user, {
    fields: [idCardInfo.user_id],
    references: [user.id]
  }),
}));

export const identity = pgTable("Identity", {
	...uuidCommon,
}, (table) => [
	// index("ix_Identity_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("ix_Identity_name").on(table.name),
]);

export const home = pgTable("Home", {
	...uuidCommon,
	userId: uuid("user_id"),
	doorNumber: integer("door_number"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Home_user_id_fkey"
		}),
]);

export const homeRelations = relations(home, ({one}) => ({
	user: one(user, {
		fields: [home.userId],
		references: [user.id]
	}),
}));


