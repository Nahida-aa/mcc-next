import { pgTable, text, timestamp, boolean, integer, jsonb, index, uniqueIndex, varchar, uuid, bigint } from "drizzle-orm/pg-core";
import { user, organization } from "../auth/table";
import { uuidWithTimestamps } from "@/server/db/columnsHelpers";

// 社区表 - 类似Discord服务器，与项目/组织1对1对应
export const community = pgTable("community", {
  ...uuidWithTimestamps,
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  image: text(),
  
  // 1对1关系：每个项目或组织对应一个社区
  type: varchar('type', { length: 20 }).notNull(), // project, organization
  entityId: varchar('entity_id', { length: 255 }).notNull(), // 项目ID或组织ID
  
  // 社区设置
  isPublic: boolean('is_public').default(true).notNull(),
  verification_level: integer('verification_level').default(0).notNull(), // 0-4, 类似Discord验证等级
  
  // 创建者
  owner_id: varchar('owner_id', { length: 255 }).notNull().references(() => user.id),
}, (table) => [
  uniqueIndex("community_entity_unique_idx").on(table.type, table.entityId), // 确保1对1
  index("community_entity_idx").on(table.type, table.entityId),
  index("community_public_idx").on(table.isPublic),
]);

// 社区成员表 - 所有权限管理的核心
export const communityMember = pgTable("community_member", {
  ...uuidWithTimestamps,
  communityId: uuid('community_id').notNull().references(() => community.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // Discord式角色系统
  roles: jsonb('roles').$type<string[]>().default([]).notNull(), // 角色ID数组
  
  // 权限位掩码 - 64位整数，每一位代表一个权限
  permissions: bigint('permissions', { mode: 'bigint' }).default(BigInt(0)).notNull(),
  
  // 成员状态
  status: varchar('status', { length: 20 }).default('active').notNull(), // active, inactive, banned, pending
  
  // 加入方式/方法
  joinMethod: varchar('join_method', { length: 20 }).default('discover').notNull(), // invite, manual_review, discover, system
  inviterId: varchar('inviter_id', { length: 255 }).references(() => user.id), // 邀请者ID（如果通过邀请加入）
  
  // joinedAt == createdAt
  nickname: varchar('nickname', { length: 100 }), // 社区内昵称, 优先级: communityMember.nickname > user.displayUsername > user.username
}, (table) => [
  uniqueIndex("community_member_unique_idx").on(table.communityId, table.userId),
  index("community_member_user_idx").on(table.userId),
  index("community_member_status_idx").on(table.status),
  index("community_member_join_method_idx").on(table.joinMethod),
  index("community_member_inviter_idx").on(table.inviterId),
]);

// 角色表 - Discord式角色系统
export const communityRole = pgTable("community_role", {
  ...uuidWithTimestamps,
  communityId: uuid('community_id').notNull().references(() => community.id, { onDelete: 'cascade' }),
  
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 7 }), // 十六进制颜色 #00FFFF
  position: integer('position').default(0).notNull(), // 角色优先级，数字越大权限越高
  
  // 角色权限位掩码
  permissions: bigint('permissions', { mode: 'bigint' }).default(BigInt(0)).notNull(),
  
  // 角色设置
  is_mentionable: boolean('is_mentionable').default(true).notNull(),
  is_hoisted: boolean('is_hoisted').default(false).notNull(), // 是否在成员列表中单独显示
  is_managed: boolean('is_managed').default(false).notNull(), // 是否由系统管理（如bot角色）
}, (table) => [
  index("community_role_community_idx").on(table.communityId),
  index("community_role_position_idx").on(table.communityId, table.position),
]);

// 频道表 - 属于社区
export const channel = pgTable("channel", {
  ...uuidWithTimestamps,
  communityId: uuid('community_id').notNull().references(() => community.id, { onDelete: 'cascade' }),
  
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  
  // 频道类型
  type: varchar('type', { length: 20 }).notNull(), // text, voice, announcement, category, forum
  parentId: uuid('parent_id').references(() => channel.id), // 分类频道ID grouping
  
  // 排序位置
  position: integer('position').default(0).notNull(),
  
  // 频道权限覆写 - 覆盖默认权限 用于给 频道的 角色或成员设置特定权限
  permissionOverwrites: jsonb('permission_overwrites').$type<Array<{
    id: string; // 角色ID或用户ID
    type: 'role' | 'member';
    allow: string; // 允许的权限位掩码（字符串形式的bigint）
    deny: string;  // 拒绝的权限位掩码
  }>>().default([]).notNull(),
  
  // 频道设置
  is_nsfw: boolean('is_nsfw').default(false).notNull(),
  rate_limit_per_user: integer('rate_limit_per_user').default(0).notNull(), // 慢速模式，秒数
}, (table) => [
  index("channel_community_idx").on(table.communityId),
  index("channel_parent_idx").on(table.parentId),
  index("channel_position_idx").on(table.communityId, table.position),
]);

// 频道消息表
export const channelMessage = pgTable("channel_message", {
  ...uuidWithTimestamps,
  channelId: uuid('channel_id').notNull().references(() => channel.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  content: text('content'),
  content_type: varchar('content_type', { length: 20 }).default('text').notNull(),
  
  // 消息关联
  reply_to_id: uuid('reply_to_id').references(() => channelMessage.id),
  threadId: uuid('thread_id').references(() => channelMessage.id),
  
  // 消息状态
  is_edited: boolean('is_edited').default(false).notNull(),
  is_deleted: boolean('is_deleted').default(false).notNull(),
  is_pinned: boolean('is_pinned').default(false).notNull(),
  
  // 消息数据
  attachments: jsonb('attachments').$type<Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>>().default([]).notNull(),
  
  mentions: jsonb('mentions').$type<{
    users?: string[];
    roles?: string[];
    channels?: string[];
    everyone?: boolean;
  }>().default({}).notNull(),
  
  reactions: jsonb('reactions').$type<Array<{
    emoji: string;
    count: number;
    users: string[];
  }>>().default([]).notNull(),
}, (table) => [
  index("channel_message_channel_idx").on(table.channelId),
  index("channel_message_user_idx").on(table.userId),
  index("channel_message_thread_idx").on(table.threadId),
  index("channel_message_created_at_idx").on(table.createdAt),
]);