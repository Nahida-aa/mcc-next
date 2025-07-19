import { pgTable, text, timestamp, boolean, integer, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { user, organization } from "./auth-schema";

// 项目主表
export const project = pgTable("project", {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(), // URL友好的标识符
  name: text('name').notNull(),
  summary: text('summary').notNull(), // 项目简介
  description: text('description'), // 详细描述 (Markdown)
  
  // 项目类型和分类
  type: text('type').notNull(), // mod, resource_pack, data_pack, world, mod_pack, plugin, project, server
  category: text('category'), // 更细分的分类
  tags: jsonb('tags').$type<string[]>().default([]).notNull(), // 标签数组
  
  // 游戏版本和环境
  game_versions: jsonb('game_versions').$type<string[]>().default([]).notNull(),
  loaders: jsonb('loaders').$type<string[]>().default([]).notNull(), // forge, fabric, quilt, neoforge 等
  environment: text('environment').notNull(), // client, server, both
  
  // 项目状态和属性
  status: text('status').default('draft').notNull(), // draft, published, archived, private
  visibility: text('visibility').default('public').notNull(), // public, private, unlisted
  is_open_source: boolean('is_open_source').default(true).notNull(),
  
  // 所有者信息 (用户或组织)
  owner_type: text('owner_type').notNull(), // user, organization
  owner_id: text('owner_id').notNull(), // 引用 user.id 或 organization.id
  
  // 许可证和法律信息
  license: text('license').default('MIT').notNull(),
  
  // 外部链接
  source_url: text('source_url'), // 源代码仓库
  issues_url: text('issues_url'), // 问题追踪
  wiki_url: text('wiki_url'), // Wiki
  discord_url: text('discord_url'), // Discord 服务器
  
  // 统计信息
  download_count: integer('download_count').default(0).notNull(),
  follow_count: integer('follow_count').default(0).notNull(),
  view_count: integer('view_count').default(0).notNull(),
  
  // 项目图标和图片
  icon_url: text('icon_url'),
  featured_gallery: jsonb('featured_gallery').$type<string[]>().default([]).notNull(),
  
  // 时间戳
  created_at: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updated_at: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
  published_at: timestamp('published_at'),
  
  // 最新版本信息
  latest_version_id: text('latest_version_id'),
}, (table) => ({
  // 索引优化
  ownerIdx: index("project_owner_idx").on(table.owner_type, table.owner_id),
  typeIdx: index("project_type_idx").on(table.type),
  statusIdx: index("project_status_idx").on(table.status),
  publishedAtIdx: index("project_published_at_idx").on(table.published_at),
  slugIdx: uniqueIndex("project_slug_idx").on(table.slug),
}));

// 项目版本表
export const projectVersion = pgTable("project_version", {
  id: text('id').primaryKey(),
  project_id: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  
  // 版本信息
  version_number: text('version_number').notNull(), // 1.0.0, 1.2.3-beta
  version_type: text('version_type').default('release').notNull(), // release, beta, alpha
  name: text('name'), // 版本名称
  changelog: text('changelog'), // 更新日志 (Markdown)
  
  // 兼容性信息
  game_versions: jsonb('game_versions').$type<string[]>().default([]).notNull(),
  loaders: jsonb('loaders').$type<string[]>().default([]).notNull(),
  
  // 版本状态
  status: text('status').default('published').notNull(), // draft, published, archived
  featured: boolean('featured').default(false).notNull(), // 是否为推荐版本
  
  // 统计信息
  download_count: integer('download_count').default(0).notNull(),
  
  // 发布者信息
  author_id: text('author_id').notNull().references(() => user.id),
  
  // 时间戳
  created_at: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  published_at: timestamp('published_at'),
}, (table) => ({
  projectIdx: index("project_version_project_idx").on(table.project_id),
  versionNumberIdx: index("project_version_number_idx").on(table.project_id, table.version_number),
}));

// 项目文件表
export const projectFile = pgTable("project_file", {
  id: text('id').primaryKey(),
  version_id: text('version_id').notNull().references(() => projectVersion.id, { onDelete: 'cascade' }),
  
  // 文件信息
  filename: text('filename').notNull(),
  display_name: text('display_name'), // 显示名称
  file_type: text('file_type').notNull(), // primary, additional, required, optional
  
  // 文件存储信息
  url: text('url').notNull(), // 文件下载URL
  storage_key: text('storage_key').notNull(), // 存储服务的key
  file_size: integer('file_size').notNull(), // 文件大小(字节)
  mime_type: text('mime_type'),
  
  // 文件哈希(用于完整性检查)
  sha1: text('sha1'),
  sha256: text('sha256'),
  
  // 统计信息
  download_count: integer('download_count').default(0).notNull(),
  
  // 时间戳
  created_at: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  versionIdx: index("project_file_version_idx").on(table.version_id),
}));

// 项目依赖表
export const projectDependency = pgTable("project_dependency", {
  id: text('id').primaryKey(),
  project_id: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  dependency_project_id: text('dependency_project_id').references(() => project.id, { onDelete: 'cascade' }),
  
  // 依赖信息
  dependency_type: text('dependency_type').notNull(), // required, optional, incompatible, embedded
  version_requirement: text('version_requirement'), // 版本要求 >=1.0.0, ~1.2.0
  
  // 外部依赖(非平台内项目)
  external_url: text('external_url'), // 外部依赖的下载链接
  external_name: text('external_name'), // 外部依赖名称
  
  created_at: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  projectIdx: index("project_dependency_project_idx").on(table.project_id),
}));

// 项目成员表 (协作者)
export const projectMember = pgTable("project_member", {
  id: text('id').primaryKey(),
  project_id: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  user_id: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // 角色权限
  role: text('role').default('contributor').notNull(), // owner, maintainer, contributor, viewer
  permissions: jsonb('permissions').$type<string[]>().default([]).notNull(), // 具体权限列表
  
  // 状态
  status: text('status').default('active').notNull(), // active, inactive, pending
  
  // 时间戳
  created_at: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updated_at: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  projectUserIdx: uniqueIndex("project_member_project_user_idx").on(table.project_id, table.user_id),
}));

// 项目关注表
export const projectFollow = pgTable("project_follow", {
  id: text('id').primaryKey(),
  project_id: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  user_id: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // 关注设置
  notification_enabled: boolean('notification_enabled').default(true).notNull(),
  
  created_at: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  projectUserIdx: uniqueIndex("project_follow_project_user_idx").on(table.project_id, table.user_id),
}));

// 项目收藏表
export const projectBookmark = pgTable("project_bookmark", {
  id: text('id').primaryKey(),
  project_id: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  user_id: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // 收藏分类
  collection_name: text('collection_name').default('default').notNull(),
  notes: text('notes'), // 用户备注
  
  created_at: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  projectUserIdx: uniqueIndex("project_bookmark_project_user_idx").on(table.project_id, table.user_id),
}));

// 项目评论表
export const projectComment = pgTable("project_comment", {
  id: text('id').primaryKey(),
  project_id: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  user_id: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // 评论内容
  content: text('content').notNull(),
  parent_id: text('parent_id').references(() => projectComment.id, { onDelete: 'cascade' }), // 回复评论
  
  // 评论状态
  status: text('status').default('published').notNull(), // published, hidden, deleted
  is_pinned: boolean('is_pinned').default(false).notNull(),
  
  // 统计信息
  like_count: integer('like_count').default(0).notNull(),
  reply_count: integer('reply_count').default(0).notNull(),
  
  created_at: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updated_at: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  projectIdx: index("project_comment_project_idx").on(table.project_id),
  parentIdx: index("project_comment_parent_idx").on(table.parent_id),
}));

// 项目评分表
export const projectRating = pgTable("project_rating", {
  id: text('id').primaryKey(),
  project_id: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  user_id: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // 评分
  rating: integer('rating').notNull(), // 1-5 星
  review: text('review'), // 评价内容
  
  created_at: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updated_at: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  projectUserIdx: uniqueIndex("project_rating_project_user_idx").on(table.project_id, table.user_id),
}));

// 项目下载统计表
export const projectDownload = pgTable("project_download", {
  id: text('id').primaryKey(),
  project_id: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  version_id: text('version_id').references(() => projectVersion.id, { onDelete: 'cascade' }),
  file_id: text('file_id').references(() => projectFile.id, { onDelete: 'cascade' }),
  
  // 下载者信息
  user_id: text('user_id').references(() => user.id), // 可能是匿名下载
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  
  // 地理位置(可选)
  country: text('country'),
  city: text('city'),
  
  created_at: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  projectIdx: index("project_download_project_idx").on(table.project_id),
  dateIdx: index("project_download_date_idx").on(table.created_at),
}));
