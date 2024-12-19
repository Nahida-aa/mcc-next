import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { group } from "./group";
import { identity, user, userPlatformInfo } from "./user";
import { tag } from "./tag";
import { proj } from "./proj";
import { resource } from "./resource";
import { timestamps, uuidCommon } from "./columnsHelpers"

export const linkGroupFollow = pgTable("LinkGroupFollow", {
	userId: integer("user_id").notNull(),
	groupId: integer("group_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [group.id],
			name: "LinkGroupFollow_group_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "LinkGroupFollow_user_id_fkey"
		}),
	primaryKey({ columns: [table.userId, table.groupId], name: "LinkGroupFollow_pkey"}),
]);

export const linkUserFollow = pgTable("LinkUserFollow", {
	followerId: integer("follower_id").notNull(),
	followedId: integer("followed_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.followedId],
			foreignColumns: [user.id],
			name: "LinkUserFollow_followed_id_fkey"
		}),
	foreignKey({
			columns: [table.followerId],
			foreignColumns: [user.id],
			name: "LinkUserFollow_follower_id_fkey"
		}),
	primaryKey({ columns: [table.followerId, table.followedId], name: "LinkUserFollow_pkey"}),
]);

export const linkUserPlatformInfoTag = pgTable("LinkUserPlatformInfoTag", {
	...timestamps,
	userPlatformInfoId: integer("user_platform_info_id").notNull(),
	tagId: integer("tag_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tag.id],
			name: "LinkUserPlatformInfoTag_tag_id_fkey"
		}),
	foreignKey({
			columns: [table.userPlatformInfoId],
			foreignColumns: [userPlatformInfo.id],
			name: "LinkUserPlatformInfoTag_user_platform_info_id_fkey"
		}),
	primaryKey({ columns: [table.userPlatformInfoId, table.tagId], name: "LinkUserPlatformInfoTag_pkey"}),
]);

export const linkGroupProj = pgTable("LinkGroupProj", {
	...timestamps,
	groupId: integer("group_id").notNull(),
	projId: integer("proj_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projId],
			foreignColumns: [proj.id],
			name: "LinkGroupProj_proj_id_fkey"
		}),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [group.id],
			name: "LinkGroupProj_group_id_fkey"
		}),
	primaryKey({ columns: [table.groupId, table.projId], name: "LinkGroupProj_pkey"}),
]);

export const linkGroupResource = pgTable("LinkGroupResource", {
	...timestamps,
	groupId: integer("group_id").notNull(),
	resourceId: integer("resource_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.resourceId],
			foreignColumns: [resource.id],
			name: "LinkGroupResource_resource_id_fkey"
		}),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [group.id],
			name: "LinkGroupResource_group_id_fkey"
		}),
	primaryKey({ columns: [table.groupId, table.resourceId], name: "LinkGroupResource_pkey"}),
]);

export const linkUserProj = pgTable("LinkUserProj", {
	...timestamps,
	userId: integer("user_id").notNull(),
	projId: integer("proj_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projId],
			foreignColumns: [proj.id],
			name: "LinkUserProj_proj_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "LinkUserProj_user_id_fkey"
		}),
	primaryKey({ columns: [table.userId, table.projId], name: "LinkUserProj_pkey"}),
]);

export const linkUserResource = pgTable("LinkUserResource", {
	...timestamps,
	userId: integer("user_id").notNull(),
	resourceId: integer("resource_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.resourceId],
			foreignColumns: [resource.id],
			name: "LinkUserResource_resource_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "LinkUserResource_user_id_fkey"
		}),
	primaryKey({ columns: [table.userId, table.resourceId], name: "LinkUserResource_pkey"}),
]);

export const linkUserGroup = pgTable("LinkUserGroup", {
	...timestamps,
	userId: integer("user_id").notNull(),
	groupId: integer("group_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [group.id],
			name: "LinkUserGroup_group_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "LinkUserGroup_user_id_fkey"
		}),
	primaryKey({ columns: [table.userId, table.groupId], name: "LinkUserGroup_pkey"}),
]);

export const linkGroupIdentity = pgTable("LinkGroupIdentity", {
	...timestamps,
	groupId: integer("group_id").notNull(),
	identityId: integer("identity_id").notNull(),
	level: integer().notNull(),
	status: varchar().notNull(),
	motivation: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.identityId],
			foreignColumns: [identity.id],
			name: "LinkGroupIdentity_identity_id_fkey"
		}),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [group.id],
			name: "LinkGroupIdentity_group_id_fkey"
		}),
	primaryKey({ columns: [table.groupId, table.identityId], name: "LinkGroupIdentity_pkey"}),
]);

export const linkUserIdentity = pgTable("LinkUserIdentity", {
	...timestamps,
	userId: integer("user_id").notNull(),
	identityId: integer("identity_id").notNull(),
	level: integer().notNull(),
	status: varchar().notNull(),
	motivation: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.identityId],
			foreignColumns: [identity.id],
			name: "LinkUserIdentity_identity_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "LinkUserIdentity_user_id_fkey"
		}),
	primaryKey({ columns: [table.userId, table.identityId], name: "LinkUserIdentity_pkey"}),
]);
