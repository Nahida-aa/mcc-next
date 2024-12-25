import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations"
import { group } from "./group";
import { identity, user } from "./user";
import { tag } from "./tag";
import { proj } from "./proj";
import { resource } from "./resource";
import { timestamps, uuidCommon } from "./columnsHelpers"

export const linkGroupFollow = pgTable("LinkGroupFollow", {
	user_id: uuid("user_id").notNull(),
	target_group_id: uuid("group_id").notNull(),
	created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.target_group_id],
			foreignColumns: [group.id],
			name: "LinkGroupFollow_target_group_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [user.id],
			name: "LinkGroupFollow_user_id_fkey"
		}),
	primaryKey({ columns: [table.user_id, table.target_group_id], name: "LinkGroupFollow_pkey"}),
]);

export const linkUserFollow = pgTable("LinkUserFollow", {
  user_id: uuid("user_id").notNull(), // 原 followerId
  target_user_id: uuid("target_user_id").notNull(), // 原 followedId
	created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.target_user_id],
			foreignColumns: [user.id],
			name: "LinkUserFollow_target_user_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [user.id],
			name: "LinkUserFollow_user_id_fkey"
		}),
	primaryKey({ columns: [table.user_id, table.target_user_id], name: "LinkUserFollow_pkey"}),
]);
export const linkUserFollowRelations = relations(linkUserFollow, ({one}) => ({
	target_user: one(user, {
		fields: [linkUserFollow.target_user_id],
		references: [user.id],
		relationName: "linkUserFollow_target_user_id"
	}),
	user: one(user, {
		fields: [linkUserFollow.user_id],
		references: [user.id],
		relationName: "linkUserFollow_user_id"
	}),
}));

export const linkGroupProj = pgTable("LinkGroupProj", {
	...timestamps,
	group_id: uuid("group_id").notNull(),
	proj_id: uuid("proj_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.proj_id],
			foreignColumns: [proj.id],
			name: "LinkGroupProj_proj_id_fkey"
		}),
	foreignKey({
			columns: [table.group_id],
			foreignColumns: [group.id],
			name: "LinkGroupProj_group_id_fkey"
		}),
	primaryKey({ columns: [table.group_id, table.proj_id], name: "LinkGroupProj_pkey"}),
]);

export const linkGroupResource = pgTable("LinkGroupResource", {
	...timestamps,
	group_id: uuid("group_id").notNull(),
	resource_id: uuid("resource_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.resource_id],
			foreignColumns: [resource.id],
			name: "LinkGroupResource_resource_id_fkey"
		}),
	foreignKey({
			columns: [table.group_id],
			foreignColumns: [group.id],
			name: "LinkGroupResource_group_id_fkey"
		}),
	primaryKey({ columns: [table.group_id, table.resource_id], name: "LinkGroupResource_pkey"}),
]);

export const linkUserProj = pgTable("LinkUserProj", {
	...timestamps,
	user_id: uuid("user_id").notNull(),
	proj_id: uuid("proj_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.proj_id],
			foreignColumns: [proj.id],
			name: "LinkUserProj_proj_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [user.id],
			name: "LinkUserProj_user_id_fkey"
		}),
	primaryKey({ columns: [table.user_id, table.proj_id], name: "LinkUserProj_pkey"}),
]);

export const linkUserResource = pgTable("LinkUserResource", {
	...timestamps,
	user_id: uuid("user_id").notNull(),
	resource_id: uuid("resource_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.resource_id],
			foreignColumns: [resource.id],
			name: "LinkUserResource_resource_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [user.id],
			name: "LinkUserResource_user_id_fkey"
		}),
	primaryKey({ columns: [table.user_id, table.resource_id], name: "LinkUserResource_pkey"}),
]);



export const linkGroupIdentity = pgTable("LinkGroupIdentity", {
	...timestamps,
	group_id: uuid("group_id").notNull(),
	identity_id: uuid("identity_id").notNull(),
	level: integer().notNull(),
	status: varchar().notNull(),
	motivation: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.identity_id],
			foreignColumns: [identity.id],
			name: "LinkGroupIdentity_identity_id_fkey"
		}),
	foreignKey({
			columns: [table.group_id],
			foreignColumns: [group.id],
			name: "LinkGroupIdentity_group_id_fkey"
		}),
	primaryKey({ columns: [table.group_id, table.identity_id], name: "LinkGroupIdentity_pkey"}),
]);

export const linkUserIdentity = pgTable("LinkUserIdentity", {
	...timestamps,
	user_id: uuid("user_id").notNull(),
	identity_id: uuid("identity_id").notNull(),
	level: integer().notNull(),
	status: varchar().notNull(),
	motivation: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.identity_id],
			foreignColumns: [identity.id],
			name: "LinkUserIdentity_identity_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [user.id],
			name: "LinkUserIdentity_user_id_fkey"
		}),
	primaryKey({ columns: [table.user_id, table.identity_id], name: "LinkUserIdentity_pkey"}),
]);
