import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const alembicVersion = pgTable("alembic_version", {
	versionNum: varchar("version_num", { length: 32 }).primaryKey().notNull(),
});

export const team = pgTable("Team", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	description: varchar().notNull(),
	followersCount: integer("followers_count").default(0).notNull(),
}, (table) => [
	index("ix_Team_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const user = pgTable("User", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	name: varchar().notNull(),
	image: varchar().notNull(),
	nickname: varchar().notNull(),
	email: varchar(),
	phone: varchar().notNull(),
	age: integer(),
	id: serial().primaryKey().notNull(),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	isSuperuser: boolean("is_superuser").notNull(),
	isStaff: boolean("is_staff").notNull(),
	isActive: boolean("is_active").notNull(),
	hashedPassword: varchar("hashed_password").notNull(),
	gender: varchar(),
	followersCount: integer("followers_count").default(0).notNull(),
	followingCount: integer("following_count").default(0).notNull(),
	description: varchar().notNull(),
}, (table) => [
	index("ix_User_age").using("btree", table.age.asc().nullsLast().op("int4_ops")),
	uniqueIndex("ix_User_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("ix_User_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const home = pgTable("Home", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	doorNumber: integer("door_number"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Home_user_id_fkey"
		}),
]);

export const idCardInfo = pgTable("IDCardInfo", {
	id: serial().primaryKey().notNull(),
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

export const identity = pgTable("Identity", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	description: varchar().notNull(),
}, (table) => [
	index("ix_Identity_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const proj = pgTable("Proj", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	description: varchar().notNull(),
}, (table) => [
	index("ix_Proj_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const resource = pgTable("Resource", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	description: varchar().notNull(),
}, (table) => [
	index("ix_Resource_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const userPlatformInfo = pgTable("UserPlatformInfo", {
	id: serial().primaryKey().notNull(),
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

export const tag = pgTable("Tag", {
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	description: varchar().notNull(),
}, (table) => [
	uniqueIndex("ix_Tag_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const linkTeamFollow = pgTable("LinkTeamFollow", {
	userId: integer("user_id").notNull(),
	teamId: integer("team_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "LinkTeamFollow_team_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "LinkTeamFollow_user_id_fkey"
		}),
	primaryKey({ columns: [table.userId, table.teamId], name: "LinkTeamFollow_pkey"}),
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
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
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

export const linkTeamProj = pgTable("LinkTeamProj", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	teamId: integer("team_id").notNull(),
	projId: integer("proj_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projId],
			foreignColumns: [proj.id],
			name: "LinkTeamProj_proj_id_fkey"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "LinkTeamProj_team_id_fkey"
		}),
	primaryKey({ columns: [table.teamId, table.projId], name: "LinkTeamProj_pkey"}),
]);

export const linkTeamResource = pgTable("LinkTeamResource", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	teamId: integer("team_id").notNull(),
	resourceId: integer("resource_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.resourceId],
			foreignColumns: [resource.id],
			name: "LinkTeamResource_resource_id_fkey"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "LinkTeamResource_team_id_fkey"
		}),
	primaryKey({ columns: [table.teamId, table.resourceId], name: "LinkTeamResource_pkey"}),
]);

export const linkUserProj = pgTable("LinkUserProj", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
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
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
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

export const linkUserTeam = pgTable("LinkUserTeam", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	userId: integer("user_id").notNull(),
	teamId: integer("team_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "LinkUserTeam_team_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "LinkUserTeam_user_id_fkey"
		}),
	primaryKey({ columns: [table.userId, table.teamId], name: "LinkUserTeam_pkey"}),
]);

export const linkTeamIdentity = pgTable("LinkTeamIdentity", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	teamId: integer("team_id").notNull(),
	identityId: integer("identity_id").notNull(),
	level: integer().notNull(),
	status: varchar().notNull(),
	motivation: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.identityId],
			foreignColumns: [identity.id],
			name: "LinkTeamIdentity_identity_id_fkey"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "LinkTeamIdentity_team_id_fkey"
		}),
	primaryKey({ columns: [table.teamId, table.identityId], name: "LinkTeamIdentity_pkey"}),
]);

export const linkUserIdentity = pgTable("LinkUserIdentity", {
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
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
