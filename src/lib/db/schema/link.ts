import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations"
import { group } from "./group";
import { identity, user } from "./user";
import { tag } from "./tag";
import { proj } from "./proj";
import { resource } from "./resource";
import { timestamps, uuidCommon } from "./columnsHelpers"

export const linkGroupFollow = pgTable("LinkGroupFollow", {
	userId: uuid("user_id").notNull(),
	targetGroupId: uuid("group_id").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.targetGroupId],
			foreignColumns: [group.id],
			name: "LinkGroupFollow_target_group_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "LinkGroupFollow_user_id_fkey"
		}),
	primaryKey({ columns: [table.userId, table.targetGroupId], name: "LinkGroupFollow_pkey"}),
]);

export const linkUserFollow = pgTable("LinkUserFollow", {
  userId: uuid("user_id").notNull(), // 原 followerId
  targetUserId: uuid("target_user_id").notNull(), // 原 followedId
	createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.targetUserId],
			foreignColumns: [user.id],
			name: "LinkUserFollow_target_user_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "LinkUserFollow_user_id_fkey"
		}),
	primaryKey({ columns: [table.userId, table.targetUserId], name: "LinkUserFollow_pkey"}),
]);
export const linkUserFollowRelations = relations(linkUserFollow, ({one}) => ({
	targetUser: one(user, {
		fields: [linkUserFollow.targetUserId],
		references: [user.id],
		relationName: "linkUserFollow_target_user_id"
	}),
	user: one(user, {
		fields: [linkUserFollow.userId],
		references: [user.id],
		relationName: "linkUserFollow_user_id"
	}),
}));

export const linkGroupProj = pgTable("LinkGroupProj", {
	...timestamps,
	groupId: uuid("group_id").notNull(),
	projId: uuid("proj_id").notNull(),
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
	groupId: uuid("group_id").notNull(),
	resourceId: uuid("resource_id").notNull(),
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
	userId: uuid("user_id").notNull(),
	projId: uuid("proj_id").notNull(),
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
	userId: uuid("user_id").notNull(),
	resourceId: uuid("resource_id").notNull(),
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
	userId: uuid("user_id").notNull(),
	groupId: uuid("group_id").notNull(),
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
	groupId: uuid("group_id").notNull(),
	identityId: uuid("identity_id").notNull(),
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
	userId: uuid("user_id").notNull(),
	identityId: uuid("identity_id").notNull(),
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
