import { pgTable, text, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { user } from "../auth/table";

// 关注功能表
export const follow = pgTable("follow", {
	id: uuid('id').primaryKey().defaultRandom(),
	followerId: text('follower_id').notNull().references(() => user.id, { onDelete: 'cascade' }), // 关注者
	followingId: text('following_id').notNull().references(() => user.id, { onDelete: 'cascade' }), // 被关注者
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

// 好友功能表
export const friend = pgTable("friend", {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }), // 用户ID
	friendId: text('friend_id').notNull().references(() => user.id, { onDelete: 'cascade' }), // 好友ID
	status: text('status').default("pending").notNull(), // pending, accepted, rejected, blocked
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	// 自动成为好友的原因：mutual_follow(互相关注), manual_request(手动请求)
	reason: text('reason').default("manual_request").notNull(),
	// 请求发起者ID (用于区分谁发起的好友请求)
	requesterId: text('requester_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

// 通知功能表
export const notification = pgTable("notification", {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }), // 接收通知的用户ID
 	type: text('type').notNull(), // follow, friend_request, friend_accept, friend_reject, system
 	title: text('title').notNull(), // 通知标题
 	content: text('content').notNull(), // 通知内容
 	relatedUserId: text('related_user_id').references(()=> user.id, { onDelete: 'cascade' }), // 相关用户ID（如关注者、好友请求发起者）
 	relatedId: text('related_id'), // 相关记录ID（如好友请求ID）
 	isRead: boolean('is_read').default(false).notNull(), // 是否已读
 	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
})
