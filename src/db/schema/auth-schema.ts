import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
					id: text('id').primaryKey(),
					name: text('name').notNull(),
 email: text('email').notNull().unique(),
 emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
 image: text('image'),
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 twoFactorEnabled: boolean('two_factor_enabled'),
 username: text('username').unique(),
 displayUsername: text('display_username'),
 isAnonymous: boolean('is_anonymous'),
 phoneNumber: text('phone_number').unique(),
 phoneNumberVerified: boolean('phone_number_verified'),
 role: text('role'), // 例如：user, admin
 banned: boolean('banned'),
 banReason: text('ban_reason'),
 banExpires: timestamp('ban_expires')
				});

export const session = pgTable("session", {
					id: text('id').primaryKey(),
					expiresAt: timestamp('expires_at').notNull(),
 token: text('token').notNull().unique(),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull(),
 ipAddress: text('ip_address'),
 userAgent: text('user_agent'),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 impersonatedBy: text('impersonated_by'),
 activeOrganizationId: text('active_organization_id')
				});

export const account = pgTable("account", {
					id: text('id').primaryKey(),
					accountId: text('account_id').notNull(),
 providerId: text('provider_id').notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 accessToken: text('access_token'),
 refreshToken: text('refresh_token'),
 idToken: text('id_token'),
 accessTokenExpiresAt: timestamp('access_token_expires_at'),
 refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
 scope: text('scope'),
 password: text('password'),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull()
				});

export const verification = pgTable("verification", {
					id: text('id').primaryKey(),
					identifier: text('identifier').notNull(),
 value: text('value').notNull(),
 expiresAt: timestamp('expires_at').notNull(),
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
				});

export const twoFactor = pgTable("two_factor", {
					id: text('id').primaryKey(),
					secret: text('secret').notNull(),
 backupCodes: text('backup_codes').notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
				});

export const organization = pgTable("organization", {
					id: text('id').primaryKey(),
					name: text('name').notNull(),
 slug: text('slug').unique(),
 logo: text('logo'),
 createdAt: timestamp('created_at').notNull(),
 metadata: text('metadata')
				});

export const member = pgTable("member", {
					id: text('id').primaryKey(),
					organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 role: text('role').default("member").notNull(), // member, admin, owner
 createdAt: timestamp('created_at').notNull()
				});

export const invitation = pgTable("invitation", {
					id: text('id').primaryKey(),
					organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
 email: text('email').notNull(),
 role: text('role'),
 status: text('status').default("pending").notNull(),
 expiresAt: timestamp('expires_at').notNull(),
 inviterId: text('inviter_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
				});

// 关注功能表
export const follow = pgTable("follow", {
					id: text('id').primaryKey(),
					followerId: text('follower_id').notNull().references(()=> user.id, { onDelete: 'cascade' }), // 关注者
 followingId: text('following_id').notNull().references(()=> user.id, { onDelete: 'cascade' }), // 被关注者
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
				});

// 好友功能表
export const friend = pgTable("friend", {
					id: text('id').primaryKey(),
					userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }), // 用户ID
 friendId: text('friend_id').notNull().references(()=> user.id, { onDelete: 'cascade' }), // 好友ID
 status: text('status').default("pending").notNull(), // pending, accepted, rejected, blocked
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 // 自动成为好友的原因：mutual_follow(互相关注), manual_request(手动请求)
 reason: text('reason').default("manual_request").notNull(),
 // 请求发起者ID (用于区分谁发起的好友请求)
 requesterId: text('requester_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
				});

// 通知功能表
export const notification = pgTable("notification", {
					id: text('id').primaryKey(),
					userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }), // 接收通知的用户ID
 type: text('type').notNull(), // follow, friend_request, friend_accept, friend_reject, system
 title: text('title').notNull(), // 通知标题
 content: text('content').notNull(), // 通知内容
 relatedUserId: text('related_user_id').references(()=> user.id, { onDelete: 'cascade' }), // 相关用户ID（如关注者、好友请求发起者）
 relatedId: text('related_id'), // 相关记录ID（如好友请求ID）
 isRead: boolean('is_read').default(false).notNull(), // 是否已读
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
				});
