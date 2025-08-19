import { pgTable, text, timestamp, boolean, integer, jsonb, index, uuid } from "drizzle-orm/pg-core";
import { user, organization } from "../auth/table";

// 文件存储表 - 统一管理所有上传的文件
export const fileStorage = pgTable("file_storage", {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // 文件基本信息
  filename: text('filename').notNull(),
  original_filename: text('original_filename').notNull(), // 用户上传时的原始文件名
  mime_type: text('mime_type').notNull(),
  file_size: integer('file_size').notNull(), // 字节
  
  // 存储信息
  storage_provider: text('storage_provider').notNull(), // local, s3, cloudflare, etc.
  storage_key: text('storage_key').notNull(), // 存储服务的key/path
  storage_url: text('storage_url').notNull(), // 访问URL
  
  // 文件哈希 - 用于去重和完整性检查
  md5: text('md5'),
  sha1: text('sha1'),
  sha256: text('sha256'),
  
  // 文件类型和用途
  file_category: text('file_category').notNull(), // avatar, project_icon, project_file, gallery, attachment
  file_purpose: text('file_purpose'), // primary, additional, screenshot, etc.
  
  // 上传者信息
  uploader_type: text('uploader_type').notNull(), // user, organization
  uploader_id: text('uploader_id').notNull(),
  
  // 文件状态
  status: text('status').default('active').notNull(), // active, deleted, quarantined
  scan_status: text('scan_status').default('pending').notNull(), // pending, clean, infected, error
  scan_result: jsonb('scan_result'), // 扫描结果详情
  
  // 访问控制
  visibility: text('visibility').default('public').notNull(), // public, private, restricted
  access_token: text('access_token'), // 私有文件的访问令牌
  
  // 统计信息
  download_count: integer('download_count').default(0).notNull(),
  view_count: integer('view_count').default(0).notNull(),
  
  // 元数据
  metadata: jsonb('metadata'), // 额外的文件元数据
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  
  // 过期时间 (临时文件)
  expires_at: timestamp('expires_at'),
  
  // 时间戳
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
  last_accessed_at: timestamp('last_accessed_at'),
}, (table) => [

  index("file_storage_uploader_idx").on(table.uploader_type, table.uploader_id),
  index("file_storage_category_idx").on(table.file_category),
  index("file_storage_status_idx").on(table.status),
  index("file_storage_hash_idx").on(table.sha256),
]);

// 文件使用关联表 - 记录文件被哪些实体使用
export const fileUsage = pgTable("file_usage", {
  id: uuid('id').primaryKey().defaultRandom(),
  file_id: uuid('file_id').notNull().references(() => fileStorage.id, { onDelete: 'cascade' }),
  
  // 使用方信息
  entity_type: text('entity_type').notNull(), // project, user, organization, comment, etc.
  entity_id: text('entity_id').notNull(),
  
  // 使用上下文
  usage_type: text('usage_type').notNull(), // icon, gallery, attachment, avatar, etc.
  usage_context: jsonb('usage_context'), // 额外的上下文信息
  
  // 排序和显示
  sort_order: integer('sort_order').default(0).notNull(),
  is_featured: boolean('is_featured').default(false).notNull(),
  
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index("file_usage_file_idx").on(table.file_id),
  index("file_usage_entity_idx").on(table.entity_type, table.entity_id),
]);

// 文件分享表 - 用于生成临时分享链接
export const fileShare = pgTable("file_share", {
  id: uuid('id').primaryKey().defaultRandom(),
  file_id: uuid('file_id').notNull().references(() => fileStorage.id, { onDelete: 'cascade' }),
  
  // 分享者信息
  sharer_id: text('sharer_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // 分享配置
  share_token: text('share_token').notNull().unique(), // 分享令牌
  password: text('password'), // 可选的访问密码
  max_downloads: integer('max_downloads'), // 最大下载次数
  download_count: integer('download_count').default(0).notNull(),
  
  // 有效期
  expires_at: timestamp('expires_at'),
  
  // 权限
  can_preview: boolean('can_preview').default(true).notNull(),
  can_download: boolean('can_download').default(true).notNull(),
  
  // 状态
  is_active: boolean('is_active').default(true).notNull(),
  
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index("file_share_token_idx").on(table.share_token),
  index("file_share_file_idx").on(table.file_id),
]);

// 文件访问日志表 - 记录文件访问和下载
export const fileAccessLog = pgTable("file_access_log", {
  id: uuid('id').primaryKey().defaultRandom(),
  file_id: uuid('file_id').notNull().references(() => fileStorage.id, { onDelete: 'cascade' }),
  
  // 访问者信息
  user_id: text('user_id').references(() => user.id), // 可能是匿名访问
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  
  // 访问类型
  access_type: text('access_type').notNull(), // view, download, preview
  access_source: text('access_source'), // direct, share_link, embed, etc.
  
  // 地理位置
  country: text('country'),
  city: text('city'),
  
  // 引用来源
  referrer: text('referrer'),
  
  // 状态
  success: boolean('success').default(true).notNull(),
  error_message: text('error_message'),
  
  // 传输信息 (下载时)
  bytes_transferred: integer('bytes_transferred'),
  transfer_time_ms: integer('transfer_time_ms'),
  
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index("file_access_log_file_idx").on(table.file_id),
  index("file_access_log_user_idx").on(table.user_id),
  index("file_access_log_date_idx").on(table.createdAt),
  index("file_access_log_type_idx").on(table.access_type),
]);

// 文件标签表 - 用于文件分类和搜索
export const fileTag = pgTable("file_tag", {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  color: text('color'), // 标签颜色
  category: text('category'), // 标签分类
  is_system: boolean('is_system').default(false).notNull(), // 是否为系统标签
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
});

// 文件标签关联表
export const fileTagRelation = pgTable("file_tag_relation", {
  id: uuid('id').primaryKey().defaultRandom(),
  file_id: uuid('file_id').notNull().references(() => fileStorage.id, { onDelete: 'cascade' }),
  tag_id: uuid('tag_id').notNull().references(() => fileTag.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index("file_tag_relation_file_tag_idx").on(table.file_id, table.tag_id),
]);
