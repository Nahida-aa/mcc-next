import { pgTable, text, timestamp, boolean, integer, jsonb, index, uniqueIndex, varchar, uuid } from "drizzle-orm/pg-core";
import { user, organization } from "../auth/table";
import { uuidWithTimestamps } from "@/server/db/columnsHelpers";


// 项目主表
export const project = pgTable("project", {
  ...uuidWithTimestamps,
  slug: varchar('slug', { length: 255 }).notNull().unique(), // URL友好的标识符
  name: varchar('name', { length: 255 }).notNull(),
  summary: varchar('summary', { length: 500 }).notNull(), // 项目简介
  description: text('description'), // 详细描述 (Markdown)
  
  // 项目类型和分类
  type: varchar('type', { length: 50 }).default('project').notNull(), // mod, resource_pack, data_pack, shader, world, modpack, plugin, project, server
  categories: jsonb('categories').$type<string[]>().default([]).notNull(), // 分类数组，替代单一category和tags
  
  // 游戏版本和环境
  gameVersions: jsonb('game_versions').$type<string[]>().default([]).notNull(),
  loaders: jsonb('loaders').$type<string[]>().default([]).notNull(), // forge, fabric, quilt, neoforge, bukkit, spigot, paper, etc.
  
  // 环境要求 - 指定项目需要在哪些环境中安装
  // mod: 根据代码判断(让用户自己填) | resource_pack/shader: 客户端 | data_pack: 服务端 | plugin: 通常服务端
  clientSide: varchar('client_side', { length: 20 }), // required, optional, unsupported
  serverSide: varchar('server_side', { length: 20 }), // required, optional, unsupported
  
  // 项目状态和属性
  status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, processing, Rejected, approved, archived, private
  visibility: varchar('visibility', { length: 20 }).default('public').notNull(), // public, unlisted, private
  isOpen_source: boolean('is_open_source').default(true).notNull(),
  
  // 所有者信息 (用户或组织)
  ownerType: varchar('owner_type', { length: 20 }).notNull(), // user, organization
  ownerId: varchar('owner_id', { length: 255 }).notNull(), // 引用 user.id 或 organization.id
  
  // 许可证和法律信息
  license: varchar('license', { length: 100 }), // 可空，用户可能不指定许可证
  
  // 外部链接
  sourceUrl: text('source_url'), // 源代码仓库
  issuesUrl: text('issues_url'), // 问题追踪
  wikiUrl: text('wiki_url'), // Wiki
  discordUrl: text('discord_url'), // Discord 服务器
  
  // 统计信息
  downloadCount: integer('download_count').default(0).notNull(),
  followCount: integer('follow_count').default(0).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  
  // 项目图标和图片
  iconUrl: text('icon_url'),
  gallery: jsonb('gallery').$type<string[]>().default([]).notNull(), // 仅 list 页, 详情页则 需要 name, summary, image, upload_at 字段
  
  published_at: timestamp('published_at'),
  
  // 最新版本信息
  latest_version_id: uuid('latest_version_id'),
}, (table) => [
  // 索引优化
  index("project_owner_idx").on(table.ownerType, table.ownerId),
  index("project_type_idx").on(table.type),
  index("project_status_idx").on(table.status),
  index("project_published_at_idx").on(table.published_at),
  uniqueIndex("project_slug_idx").on(table.slug),
]);

// 项目成员表 (目前不等于社区成员) (协作者) contributor,collaborator, creator
export const projectMember = pgTable("project_member", {
  ...uuidWithTimestamps,
  projectId: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  
  // 成员信息 - 支持用户和组织
  entityType: varchar('entity_type', { length: 20 }).notNull(), // 'user', 'organization'
  entityId: varchar('entity_id', { length: 255 }).notNull(), // 引用 user.id 或 organization.id
  
  // 角色权限
  role: varchar('role', { length: 20 }).default('member').notNull(), // member, owner, maintainer, contributor, viewer // 可以自定义, 具体权限根据 permissions 决定
  isOwner: boolean("is_owner").default(false).notNull(), // 真正的项目所有者
  permissions: jsonb('permissions').$type<string[]>().default([]).notNull(), // upload_version, delete_version, edit_metadata, edit_body, manage_invite, manage_member, delete_project, view_analytics, view_revenue
  
  // 状态
  status: varchar('status', { length: 20 }).default('pending').notNull(), // active, inactive, pending: 邀请中
  
  // 加入方式/方法
  joinMethod: varchar('join_method', { length: 20 }).default('invite').notNull(), // invite, manual_review(先不实现,因为可以通过社区联系到有权限的人,来邀请我加入), system, 不同于社区成员这里没有 discover
  inviterId: varchar('inviter_id', { length: 255 }).references(() => user.id), // 邀请者ID（如果通过邀请加入）
}, (table) => [
  // 复合索引确保唯一性
  uniqueIndex("project_member_unique_idx").on(table.projectId, table.entityType, table.entityId),
  // 查询优化索引
  index("project_member_project_idx").on(table.projectId),
  index("project_member_type_idx").on(table.entityType, table.entityId),
]);

// 项目版本表
export const projectVersion = pgTable("project_version", {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  
  // 版本信息
  versionNumber: varchar('version_number', { length: 50 }).notNull(), // 1.0.0, 1.2.3, 1.0.0-beta.1
  name: varchar('name', { length: 255 }), // 版本名称
  changelog: text('changelog'), // 更新日志 (Markdown) 
  
  // 兼容性信息 - 从所有文件聚合而来，用于版本列表页显示
  gameVersions: jsonb('game_versions').$type<string[]>().default([]).notNull(),
  loaders: jsonb('loaders').$type<string[]>().default([]).notNull(),
  
  // 版本状态
  status: varchar('status', { length: 20 }).default('uploading').notNull(), // uploading, processing, rejected, approved, published, archived
  featured: boolean('featured').default(false).notNull(), // 是否为推荐版本
  
  // 统计信息
  downloadCount: integer('download_count').default(0).notNull(),
  
  // 发布者信息
  publisherId: varchar('publisher_id', { length: 255 }).notNull().references(() => user.id),
  // 时间戳
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(), // 等同于 published_at
}, (table) => [
  index("project_version_project_idx").on(table.projectId),
  index("project_version_number_idx").on(table.projectId, table.versionNumber),
]);
// 项目文件表
// 一个版本可以有多个主要文件，例如：
// mod_fabric_1.20.1-1.20.6.jar (primary, fabric, 1.20.1-1.20.6)
// mod_forge_1.20.1-1.20.6.jar (primary, forge, 1.20.1-1.20.6)
// mod-sources_fabric_1.20.1-1.20.6 (non-primary)
export const versionFile = pgTable("version_file", {
  ...uuidWithTimestamps,
  version_id: uuid('version_id').notNull().references(() => projectVersion.id, { onDelete: 'cascade' }),
  
  // 文件信息
  name: varchar('name', { length: 255 }).notNull(),
  isPrimary: boolean('is_primary').default(true).notNull(), // 是否为主要文件
  
  // 兼容性信息 - 与主要文件直接关联
  gameVersions: jsonb('game_versions').$type<string[]>().default([]).notNull(),
  loaders: jsonb('loaders').$type<string[]>().default([]).notNull(),
  
  // 上传状态 - 简化为三种状态
  uploadStatus: varchar('upload_status', { length: 20 }).default('pending').notNull(), // pending:等待客户端向s3<oss,r2>上传, completed, failed
  
  // 文件存储信息
  storageKey: varchar('storage_key', { length: 500 }), // 存储服务的key projects/{project_id}/versions/{version_id}/mod_fabric_1.20.1-1.20.6.jar
  // 理论上这两个值应该相同，但在以下情况下可能出现差异：1.网络传输问题：文件损坏或传输不完整;2.客户端篡改：恶意用户可能伪造 expected_size;3.浏览器兼容性：某些老版本浏览器的 File.size 可能不准确;4.多部分上传：分片上传时的边界情况
  size: integer('size'), // 文件实际大小(字节) - 上传完成后从存储服务获取
  expectedSize: integer('expected_size'), // 客户端File对象大小 - 用于预签名URL限制和进度计算
  type: varchar('type', { length: 100 }).notNull(), // mime_type
  
  // 文件哈希(用于完整性检查) - 上传完成后填入
  sha1: varchar('sha1', { length: 40 }),
  sha256: varchar('sha256', { length: 64 }),
  
  // 统计信息
  downloadCount: integer('download_count').default(0).notNull(),
  
}, (table) => [
  index("project_file_version_idx").on(table.version_id),
]);

// 项目依赖表
export const projectDependency = pgTable("project_dependency", {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  dependencyProjectId: uuid('dependency_project_id').references(() => project.id, { onDelete: 'cascade' }),
  
  // 依赖信息
  dependency_type: varchar('dependency_type', { length: 20 }).notNull(), // required, optional, incompatible, embedded
  version_requirement: varchar('version_requirement', { length: 100 }), // 版本要求 >=1.0.0, ~1.2.0
  
  // 外部依赖(非平台内项目)
  externalUrl: text('external_url'), // 外部依赖的下载链接
  externalName: varchar('external_name', { length: 255 }), // 外部依赖名称
  
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index("project_dependency_project_idx").on(table.projectId),
]);



// 项目关注表
export const projectFollow = pgTable("project_follow", {
  id: uuid('id').primaryKey().defaultRandom(),
  project_id: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  user_id: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // 关注设置
  notification_enabled: boolean('notification_enabled').default(true).notNull(),
  
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [

  uniqueIndex("project_follow_project_user_idx").on(table.project_id, table.user_id),
]);

// 项目收藏表
export const projectCollection = pgTable("project_collection", {
  id: uuid('id').primaryKey().defaultRandom(),
  project_id: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  user_id: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // 收藏分类
  collection_name: varchar('collection_name', { length: 100 }).default('default').notNull(),
  notes: text('notes'), // 用户备注
  
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  uniqueIndex("project_collection_project_user_idx").on(table.project_id, table.user_id),
]);

// 项目评论表
export const projectComment = pgTable("project_comment", {
  ...uuidWithTimestamps,
  project_id: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  user_id: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // 评论内容
  content: text('content').notNull(),
  parent_id: uuid('parent_id').references(() => projectComment.id, { onDelete: 'cascade' }), // 回复评论
  
  // 评论状态
  status: varchar('status', { length: 20 }).default('published').notNull(), // published, hidden, deleted
  is_pinned: boolean('is_pinned').default(false).notNull(),
  
  // 统计信息
  like_count: integer('like_count').default(0).notNull(),
  reply_count: integer('reply_count').default(0).notNull(),
}, (table) => [
  index("project_comment_project_idx").on(table.project_id),
  index("project_comment_parent_idx").on(table.parent_id),
]);

// 项目评分表
export const projectRating = pgTable("project_rating", {
  id: uuid('id').primaryKey().defaultRandom(),
  project_id: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  user_id: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // 评分
  rating: integer('rating').notNull(), // 1-5 星
  review: text('review'), // 评价内容
  
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  uniqueIndex("project_rating_project_user_idx").on(table.project_id, table.user_id),

]);

// 项目下载统计表
export const projectDownload = pgTable("project_download", {
  id: uuid('id').primaryKey().defaultRandom(),
  project_id: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  version_id: uuid('version_id').references(() => projectVersion.id, { onDelete: 'cascade' }),
  file_id: uuid('file_id').references(() => versionFile.id, { onDelete: 'cascade' }),
  
  // 下载者信息
  user_id: varchar('user_id', { length: 255 }).references(() => user.id), // 可能是匿名下载
  ip_address: varchar('ip_address', { length: 45 }), // IPv6 最长45字符
  user_agent: text('user_agent'),
  
  // 地理位置(可选)
  country: varchar('country', { length: 50 }),
  city: varchar('city', { length: 100 }),
  
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index("project_download_project_idx").on(table.project_id),
  index("project_download_date_idx").on(table.createdAt),
]);


