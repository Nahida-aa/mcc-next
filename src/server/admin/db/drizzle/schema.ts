import { pgTable, unique, text, timestamp, foreignKey, uniqueIndex, uuid, boolean, index, jsonb, integer, varchar, type AnyPgColumn, bigint, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const organization = pgTable("organization", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	logo: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	metadata: text(),
	summary: text(),
	description: text(),
}, (table) => [
	unique("organization_slug_unique").on(table.slug),
]);

export const member = pgTable("member", {
	id: text().primaryKey().notNull(),
	organizationId: text("organization_id").notNull(),
	userId: text("user_id").notNull(),
	role: text().default('member').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "member_organization_id_organization_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "member_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
	impersonatedBy: text("impersonated_by"),
	activeOrganizationId: text("active_organization_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const twoFactor = pgTable("two_factor", {
	id: text().primaryKey().notNull(),
	secret: text().notNull(),
	backupCodes: text("backup_codes").notNull(),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "two_factor_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const follow = pgTable("follow", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	followerId: text("follower_id").notNull(),
	targetId: text("target_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	uniqueIndex("follow_unique_follower_target_idx").using("btree", table.followerId.asc().nullsLast().op("text_ops"), table.targetId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.followerId],
			foreignColumns: [user.id],
			name: "follow_follower_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.targetId],
			foreignColumns: [user.id],
			name: "follow_target_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const friend = pgTable("friend", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user1Id: text("user1_id").notNull(),
	user2Id: text("user2_id").notNull(),
	status: text().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
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

export const invitation = pgTable("invitation", {
	id: text().primaryKey().notNull(),
	organizationId: text("organization_id").notNull(),
	email: text().notNull(),
	role: text(),
	status: text().default('pending').notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	inviterId: text("inviter_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "invitation_organization_id_organization_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.inviterId],
			foreignColumns: [user.id],
			name: "invitation_inviter_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	twoFactorEnabled: boolean("two_factor_enabled"),
	username: text().notNull(),
	displayUsername: text("display_username"),
	isAnonymous: boolean("is_anonymous"),
	phoneNumber: text("phone_number"),
	phoneNumberVerified: boolean("phone_number_verified"),
	role: text(),
	banned: boolean(),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires", { mode: 'string' }),
	summary: text(),
	description: text(),
}, (table) => [
	unique("user_email_unique").on(table.email),
	unique("user_username_unique").on(table.username),
	unique("user_phone_number_unique").on(table.phoneNumber),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const fileUsage = pgTable("file_usage", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fileId: uuid("file_id").notNull(),
	entityType: text("entity_type").notNull(),
	entityId: text("entity_id").notNull(),
	usageType: text("usage_type").notNull(),
	usageContext: jsonb("usage_context"),
	sortOrder: integer("sort_order").default(0).notNull(),
	isFeatured: boolean("is_featured").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("file_usage_entity_idx").using("btree", table.entityType.asc().nullsLast().op("text_ops"), table.entityId.asc().nullsLast().op("text_ops")),
	index("file_usage_file_idx").using("btree", table.fileId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.fileId],
			foreignColumns: [fileStorage.id],
			name: "file_usage_file_id_file_storage_id_fk"
		}).onDelete("cascade"),
]);

export const fileAccessLog = pgTable("file_access_log", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fileId: uuid("file_id").notNull(),
	userId: text("user_id"),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	accessType: text("access_type").notNull(),
	accessSource: text("access_source"),
	country: text(),
	city: text(),
	referrer: text(),
	success: boolean().default(true).notNull(),
	errorMessage: text("error_message"),
	bytesTransferred: integer("bytes_transferred"),
	transferTimeMs: integer("transfer_time_ms"),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("file_access_log_date_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("file_access_log_file_idx").using("btree", table.fileId.asc().nullsLast().op("uuid_ops")),
	index("file_access_log_type_idx").using("btree", table.accessType.asc().nullsLast().op("text_ops")),
	index("file_access_log_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.fileId],
			foreignColumns: [fileStorage.id],
			name: "file_access_log_file_id_file_storage_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "file_access_log_user_id_user_id_fk"
		}),
]);

export const fileTag = pgTable("file_tag", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	color: text(),
	category: text(),
	isSystem: boolean("is_system").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	unique("file_tag_name_unique").on(table.name),
]);

export const projectCollection = pgTable("project_collection", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	collectionName: varchar("collection_name", { length: 100 }).default('default').notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("project_collection_project_user_idx").using("btree", table.projectId.asc().nullsLast().op("text_ops"), table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "project_collection_project_id_project_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "project_collection_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const fileStorage = pgTable("file_storage", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	filename: text().notNull(),
	originalFilename: text("original_filename").notNull(),
	mimeType: text("mime_type").notNull(),
	fileSize: integer("file_size").notNull(),
	storageProvider: text("storage_provider").notNull(),
	storageKey: text("storage_key").notNull(),
	storageUrl: text("storage_url").notNull(),
	md5: text(),
	sha1: text(),
	sha256: text(),
	fileCategory: text("file_category").notNull(),
	filePurpose: text("file_purpose"),
	uploaderType: text("uploader_type").notNull(),
	uploaderId: text("uploader_id").notNull(),
	status: text().default('active').notNull(),
	scanStatus: text("scan_status").default('pending').notNull(),
	scanResult: jsonb("scan_result"),
	visibility: text().default('public').notNull(),
	accessToken: text("access_token"),
	downloadCount: integer("download_count").default(0).notNull(),
	viewCount: integer("view_count").default(0).notNull(),
	metadata: jsonb(),
	tags: jsonb().default([]).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	lastAccessedAt: timestamp("last_accessed_at", { mode: 'string' }),
}, (table) => [
	index("file_storage_category_idx").using("btree", table.fileCategory.asc().nullsLast().op("text_ops")),
	index("file_storage_hash_idx").using("btree", table.sha256.asc().nullsLast().op("text_ops")),
	index("file_storage_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("file_storage_uploader_idx").using("btree", table.uploaderType.asc().nullsLast().op("text_ops"), table.uploaderId.asc().nullsLast().op("text_ops")),
]);

export const fileShare = pgTable("file_share", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fileId: uuid("file_id").notNull(),
	sharerId: text("sharer_id").notNull(),
	shareToken: text("share_token").notNull(),
	password: text(),
	maxDownloads: integer("max_downloads"),
	downloadCount: integer("download_count").default(0).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	canPreview: boolean("can_preview").default(true).notNull(),
	canDownload: boolean("can_download").default(true).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("file_share_file_idx").using("btree", table.fileId.asc().nullsLast().op("uuid_ops")),
	index("file_share_token_idx").using("btree", table.shareToken.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.fileId],
			foreignColumns: [fileStorage.id],
			name: "file_share_file_id_file_storage_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.sharerId],
			foreignColumns: [user.id],
			name: "file_share_sharer_id_user_id_fk"
		}).onDelete("cascade"),
	unique("file_share_share_token_unique").on(table.shareToken),
]);

export const notificationReceiver = pgTable("notification_receiver", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	notificationId: uuid("notification_id").notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	readAt: timestamp("read_at", { mode: 'string' }),
}, (table) => [
	index("notification_receiver_is_read_idx").using("btree", table.isRead.asc().nullsLast().op("bool_ops")),
	uniqueIndex("notification_receiver_unique_idx").using("btree", table.notificationId.asc().nullsLast().op("text_ops"), table.userId.asc().nullsLast().op("text_ops")),
	index("notification_receiver_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.notificationId],
			foreignColumns: [notification.id],
			name: "notification_receiver_notification_id_notification_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "notification_receiver_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const project = pgTable("project", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	summary: varchar({ length: 500 }).notNull(),
	description: text(),
	type: varchar({ length: 50 }).default('project').notNull(),
	categories: jsonb().default([]).notNull(),
	gameVersions: jsonb("game_versions").default([]).notNull(),
	loaders: jsonb().default([]).notNull(),
	clientSide: varchar("client_side", { length: 20 }),
	serverSide: varchar("server_side", { length: 20 }),
	status: varchar({ length: 20 }).default('draft').notNull(),
	visibility: varchar({ length: 20 }).default('public').notNull(),
	isOpenSource: boolean("is_open_source").default(true).notNull(),
	ownerType: varchar("owner_type", { length: 20 }).notNull(),
	ownerId: varchar("owner_id", { length: 255 }).notNull(),
	license: varchar({ length: 100 }),
	sourceUrl: text("source_url"),
	issuesUrl: text("issues_url"),
	wikiUrl: text("wiki_url"),
	discordUrl: text("discord_url"),
	downloadCount: integer("download_count").default(0).notNull(),
	followCount: integer("follow_count").default(0).notNull(),
	viewCount: integer("view_count").default(0).notNull(),
	icon: text(),
	gallery: jsonb().default([]).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	latestVersionId: uuid("latest_version_id"),
}, (table) => [
	index("project_owner_idx").using("btree", table.ownerType.asc().nullsLast().op("text_ops"), table.ownerId.asc().nullsLast().op("text_ops")),
	index("project_published_at_idx").using("btree", table.publishedAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("project_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("project_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("project_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	unique("project_slug_unique").on(table.slug),
]);

export const notificationSettings = pgTable("notification_settings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	projectInviteReceived: boolean("project_invite_received").default(true).notNull(),
	projectInviteAccepted: boolean("project_invite_accepted").default(true).notNull(),
	projectInviteRejected: boolean("project_invite_rejected").default(false).notNull(),
	projectRequestReceived: boolean("project_request_received").default(true).notNull(),
	projectRequestApproved: boolean("project_request_approved").default(true).notNull(),
	projectRequestRejected: boolean("project_request_rejected").default(false).notNull(),
	projectUpdate: boolean("project_update").default(true).notNull(),
	versionPublished: boolean("version_published").default(true).notNull(),
	projectFollowed: boolean("project_followed").default(true).notNull(),
	projectCollected: boolean("project_collected").default(true).notNull(),
	communityInviteReceived: boolean("community_invite_received").default(true).notNull(),
	communityInviteAccepted: boolean("community_invite_accepted").default(true).notNull(),
	communityRequestReceived: boolean("community_request_received").default(true).notNull(),
	communityRequestApproved: boolean("community_request_approved").default(true).notNull(),
	communityMemberJoined: boolean("community_member_joined").default(true).notNull(),
	commentReceived: boolean("comment_received").default(true).notNull(),
	commentLiked: boolean("comment_liked").default(false).notNull(),
	mentionReceived: boolean("mention_received").default(true).notNull(),
	systemAnnouncement: boolean("system_announcement").default(true).notNull(),
	securityAlert: boolean("security_alert").default(true).notNull(),
	emailEnabled: boolean("email_enabled").default(false).notNull(),
	webEnabled: boolean("web_enabled").default(true).notNull(),
	pushEnabled: boolean("push_enabled").default(true).notNull(),
}, (table) => [
	uniqueIndex("notification_settings_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "notification_settings_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const projectFollow = pgTable("project_follow", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	notificationEnabled: boolean("notification_enabled").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("project_follow_project_user_idx").using("btree", table.projectId.asc().nullsLast().op("text_ops"), table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "project_follow_project_id_project_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "project_follow_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const projectRating = pgTable("project_rating", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	rating: integer().notNull(),
	review: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("project_rating_project_user_idx").using("btree", table.projectId.asc().nullsLast().op("text_ops"), table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "project_rating_project_id_project_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "project_rating_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const projectVersion = pgTable("project_version", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	versionNumber: varchar("version_number", { length: 50 }).notNull(),
	name: varchar({ length: 255 }),
	changelog: text(),
	gameVersions: jsonb("game_versions").default([]).notNull(),
	loaders: jsonb().default([]).notNull(),
	status: varchar({ length: 20 }).default('uploading').notNull(),
	featured: boolean().default(false).notNull(),
	downloadCount: integer("download_count").default(0).notNull(),
	publisherId: varchar("publisher_id", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	channelId: uuid("channel_id").notNull(),
}, (table) => [
	uniqueIndex("project_version_number_unique_idx").using("btree", table.projectId.asc().nullsLast().op("text_ops"), table.versionNumber.asc().nullsLast().op("text_ops")),
	index("project_version_project_idx").using("btree", table.projectId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "project_version_project_id_project_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.publisherId],
			foreignColumns: [user.id],
			name: "project_version_publisher_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.channelId],
			foreignColumns: [channel.id],
			name: "project_version_channel_id_channel_id_fk"
		}),
]);

export const projectComment = pgTable("project_comment", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	content: text().notNull(),
	parentId: uuid("parent_id"),
	status: varchar({ length: 20 }).default('published').notNull(),
	isPinned: boolean("is_pinned").default(false).notNull(),
	likeCount: integer("like_count").default(0).notNull(),
	replyCount: integer("reply_count").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index("project_comment_parent_idx").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index("project_comment_project_idx").using("btree", table.projectId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "project_comment_project_id_project_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "project_comment_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "project_comment_parent_id_project_comment_id_fk"
		}).onDelete("cascade"),
]);

export const projectDependency = pgTable("project_dependency", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	dependencyProjectId: uuid("dependency_project_id"),
	dependencyType: varchar("dependency_type", { length: 20 }).notNull(),
	versionRequirement: varchar("version_requirement", { length: 100 }),
	externalUrl: text("external_url"),
	externalName: varchar("external_name", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("project_dependency_project_idx").using("btree", table.projectId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "project_dependency_project_id_project_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.dependencyProjectId],
			foreignColumns: [project.id],
			name: "project_dependency_dependency_project_id_project_id_fk"
		}).onDelete("cascade"),
]);

export const projectMember = pgTable("project_member", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	entityId: varchar("entity_id", { length: 255 }).notNull(),
	role: varchar({ length: 20 }).default('member').notNull(),
	permissions: jsonb().default([]).notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	entityType: varchar("entity_type", { length: 20 }).notNull(),
	isOwner: boolean("is_owner").default(false).notNull(),
	joinMethod: varchar("join_method", { length: 20 }).default('invite').notNull(),
	inviterId: varchar("inviter_id", { length: 255 }),
}, (table) => [
	index("project_member_project_idx").using("btree", table.projectId.asc().nullsLast().op("uuid_ops")),
	index("project_member_type_idx").using("btree", table.entityType.asc().nullsLast().op("text_ops"), table.entityId.asc().nullsLast().op("text_ops")),
	uniqueIndex("project_member_unique_idx").using("btree", table.projectId.asc().nullsLast().op("uuid_ops"), table.entityType.asc().nullsLast().op("uuid_ops"), table.entityId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "project_member_project_id_project_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.inviterId],
			foreignColumns: [user.id],
			name: "project_member_inviter_id_user_id_fk"
		}),
]);

export const versionFile = pgTable("version_file", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	versionId: uuid("version_id").notNull(),
	name: varchar({ length: 1024 }).notNull(),
	storageKey: varchar("storage_key", { length: 500 }).notNull(),
	size: integer(),
	type: varchar({ length: 100 }).notNull(),
	sha1: varchar({ length: 40 }),
	sha256: varchar({ length: 64 }),
	downloadCount: integer("download_count").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	uploadStatus: varchar("upload_status", { length: 20 }).default('pending').notNull(),
	actualSize: integer("actual_Size"),
	isPrimary: boolean("is_primary").default(true).notNull(),
	gameVersions: jsonb("game_versions").default([]).notNull(),
	loaders: jsonb().default([]).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index("project_file_version_idx").using("btree", table.versionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.versionId],
			foreignColumns: [projectVersion.id],
			name: "version_file_version_id_project_version_id_fk"
		}).onDelete("cascade"),
]);

export const fileTagRelation = pgTable("file_tag_relation", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fileId: uuid("file_id").notNull(),
	tagId: uuid("tag_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("file_tag_relation_file_tag_idx").using("btree", table.fileId.asc().nullsLast().op("uuid_ops"), table.tagId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.fileId],
			foreignColumns: [fileStorage.id],
			name: "file_tag_relation_file_id_file_storage_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [fileTag.id],
			name: "file_tag_relation_tag_id_file_tag_id_fk"
		}).onDelete("cascade"),
]);

export const notification = pgTable("notification", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	senderId: varchar("sender_id", { length: 255 }),
	type: varchar({ length: 255 }).notNull(),
	content: jsonb().default({}).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index("notification_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("notification_sender_idx").using("btree", table.senderId.asc().nullsLast().op("text_ops")),
	index("notification_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.senderId],
			foreignColumns: [user.id],
			name: "notification_sender_id_user_id_fk"
		}),
]);

export const projectDownload = pgTable("project_download", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	versionId: uuid("version_id"),
	fileId: uuid("file_id"),
	userId: varchar("user_id", { length: 255 }),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	country: varchar({ length: 50 }),
	city: varchar({ length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("project_download_date_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("project_download_project_idx").using("btree", table.projectId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "project_download_project_id_project_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.versionId],
			foreignColumns: [projectVersion.id],
			name: "project_download_version_id_project_version_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "project_download_user_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.fileId],
			foreignColumns: [versionFile.id],
			name: "project_download_file_id_version_file_id_fk"
		}).onDelete("cascade"),
]);

export const channel = pgTable("channel", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	communityId: uuid("community_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	type: varchar({ length: 20 }).default('chat').notNull(),
	parentId: uuid("parent_id"),
	position: integer().default(0).notNull(),
	permissionOverwrites: jsonb("permission_overwrites").default([]).notNull(),
	isNsfw: boolean("is_nsfw").default(false).notNull(),
	rateLimitPerUser: integer("rate_limit_per_user").default(0).notNull(),
}, (table) => [
	index("channel_community_idx").using("btree", table.communityId.asc().nullsLast().op("uuid_ops")),
	index("channel_parent_idx").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index("channel_position_idx").using("btree", table.communityId.asc().nullsLast().op("int4_ops"), table.position.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.communityId],
			foreignColumns: [community.id],
			name: "channel_community_id_community_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "channel_parent_id_channel_id_fk"
		}),
]);

export const community = pgTable("community", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	name: varchar({ length: 255 }).notNull(),
	summary: varchar({ length: 500 }),
	image: text(),
	type: varchar({ length: 20 }).notNull(),
	entityId: varchar("entity_id", { length: 255 }).notNull(),
	defaultChannelId: uuid("default_channel_id"),
	isPublic: boolean("is_public").default(true).notNull(),
	verificationLevel: integer("verification_level").default(0).notNull(),
	memberCount: integer("member_count").default(1).notNull(),
	ownerId: varchar("owner_id", { length: 255 }).notNull(),
}, (table) => [
	index("community_entity_idx").using("btree", table.type.asc().nullsLast().op("text_ops"), table.entityId.asc().nullsLast().op("text_ops")),
	uniqueIndex("community_entity_unique_idx").using("btree", table.type.asc().nullsLast().op("text_ops"), table.entityId.asc().nullsLast().op("text_ops")),
	index("community_public_idx").using("btree", table.isPublic.asc().nullsLast().op("bool_ops")),
	foreignKey({
			columns: [table.defaultChannelId],
			foreignColumns: [channel.id],
			name: "community_default_channel_id_channel_id_fk"
		}),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "community_owner_id_user_id_fk"
		}),
]);

export const communityMember = pgTable("community_member", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	communityId: uuid("community_id").notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	roles: jsonb().default([]).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	permissions: bigint({ mode: "number" }).default(0).notNull(),
	isOwner: boolean("is_owner").default(false).notNull(),
	status: varchar({ length: 20 }).default('active').notNull(),
	joinMethod: varchar("join_method", { length: 20 }).default('discover').notNull(),
	inviterId: varchar("inviter_id", { length: 255 }),
	nickname: varchar({ length: 100 }),
}, (table) => [
	index("community_member_inviter_idx").using("btree", table.inviterId.asc().nullsLast().op("text_ops")),
	index("community_member_join_method_idx").using("btree", table.joinMethod.asc().nullsLast().op("text_ops")),
	index("community_member_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	uniqueIndex("community_member_unique_idx").using("btree", table.communityId.asc().nullsLast().op("uuid_ops"), table.userId.asc().nullsLast().op("text_ops")),
	index("community_member_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.communityId],
			foreignColumns: [community.id],
			name: "community_member_community_id_community_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "community_member_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.inviterId],
			foreignColumns: [user.id],
			name: "community_member_inviter_id_user_id_fk"
		}),
]);

export const communityRole = pgTable("community_role", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	communityId: uuid("community_id").notNull(),
	name: varchar({ length: 100 }).notNull(),
	color: varchar({ length: 7 }),
	position: integer().default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	permissions: bigint({ mode: "number" }).default(0).notNull(),
	isMentionable: boolean("is_mentionable").default(true).notNull(),
	isHoisted: boolean("is_hoisted").default(false).notNull(),
	isManaged: boolean("is_managed").default(false).notNull(),
}, (table) => [
	index("community_role_community_idx").using("btree", table.communityId.asc().nullsLast().op("uuid_ops")),
	index("community_role_position_idx").using("btree", table.communityId.asc().nullsLast().op("int4_ops"), table.position.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.communityId],
			foreignColumns: [community.id],
			name: "community_role_community_id_community_id_fk"
		}).onDelete("cascade"),
]);

export const channelMessage = pgTable("channel_message", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	channelId: uuid("channel_id").notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	content: text(),
	contentType: varchar("content_type", { length: 20 }).default('text').notNull(),
	replyToId: uuid("reply_to_id"),
	isEdited: boolean("is_edited").default(false).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	isPinned: boolean("is_pinned").default(false).notNull(),
	attachments: jsonb().default([]).notNull(),
	mentions: jsonb().default({}).notNull(),
	reactions: jsonb().default([]).notNull(),
}, (table) => [
	index("channel_message_channel_idx").using("btree", table.channelId.asc().nullsLast().op("uuid_ops")),
	index("channel_message_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("channel_message_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.channelId],
			foreignColumns: [channel.id],
			name: "channel_message_channel_id_channel_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "channel_message_user_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.replyToId],
			foreignColumns: [table.id],
			name: "channel_message_reply_to_id_channel_message_id_fk"
		}),
]);

export const dmChannelParticipant = pgTable("dm_channel_participant", {
	channelId: uuid("channel_id").notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.channelId],
			foreignColumns: [channel.id],
			name: "dm_channel_participant_channel_id_channel_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "dm_channel_participant_user_id_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.channelId, table.userId], name: "dm_channel_participant_channel_id_user_id_pk"}),
]);

export const userReadState = pgTable("user_read_state", {
	userId: varchar("user_id", { length: 32 }).notNull(),
	channelId: uuid("channel_id").notNull(),
	lastReadMessageId: uuid("last_read_message_id").notNull(),
	lastReadAt: timestamp("last_read_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_read_state_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.channelId],
			foreignColumns: [channel.id],
			name: "user_read_state_channel_id_channel_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.lastReadMessageId],
			foreignColumns: [channelMessage.id],
			name: "user_read_state_last_read_message_id_channel_message_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.channelId], name: "user_read_state_user_id_channel_id_pk"}),
]);
