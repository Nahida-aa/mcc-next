import type { InferSelectModel } from 'drizzle-orm';
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid } from "drizzle-orm/pg-core"
import { timestamps, uuidCommon } from "./columnsHelpers"

export const user = pgTable("User", {
  ...uuidCommon,
  image: varchar(),
  nickname: varchar("nickname", { length: 32 }),
  email: varchar('email', { length: 64 }),
  hashedPassword: varchar("hashed_password", { length: 64 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  gender: varchar(),
  age: integer(),
  lastLogin: timestamp("last_login"),
  followersCount: integer("followers_count").default(0).notNull(),
  followingCount: integer("following_count").default(0).notNull(),
  isSuperuser: boolean("is_superuser").default(false).notNull(),
  isStaff: boolean("is_staff").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
  index("ix_User_age").using("btree", table.age.asc().nullsLast().op("int4_ops")),
  uniqueIndex("ix_User_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
  uniqueIndex("ix_User_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export type User = InferSelectModel<typeof user>;

export const idCardInfo = pgTable("IDCardInfo", {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	userId: integer("user_id"),
	idCardNumber: varchar("id_card_number").notNull(),
	idCardHolder: varchar("id_card_holder").notNull(),
	isRealName: boolean("is_real_name").notNull(),
	frontImageUrl: varchar("front_image_url"),
	backImageUrl: varchar("back_image_url"),
}, (table) => [
	uniqueIndex("ix_IDCardInfo_id_card_number").using("btree", table.idCardNumber.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "IDCardInfo_user_id_fkey"
		}),
]);

export const userPlatformInfo = pgTable("UserPlatformInfo", {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	userId: integer("user_id"),
	mcExperience: varchar("mc_experience").notNull(),
	playReason: varchar("play_reason").notNull(),
	serverType: varchar("server_type").notNull(),
	desiredPartners: varchar("desired_partners").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UserPlatformInfo_user_id_fkey"
		}),
]);

export const identity = pgTable("Identity", {
	...uuidCommon,
}, (table) => [
	index("ix_Identity_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);



export const home = pgTable("Home", {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	userId: integer("user_id"),
	doorNumber: integer("door_number"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Home_user_id_fkey"
		}),
]);