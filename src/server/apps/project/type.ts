/*
使用示例:

// 列表页 API
GET /api/projects -> ProjectListResponse
GET /api/projects?type=mod&page=1 -> ProjectListResponse

// 详情页 API  
GET /api/projects/{slug} -> ProjectDetail

// 组件中使用
interface ProjectListProps {
  projects: ProjectListItem[];
}

interface ProjectDetailProps {
  project: ProjectDetail;
}
*/

// 项目所有者类型
export type ProjectOwner = {
  type: 'user' | 'organization';
  id: string;
  name: string;
  username?: string; // 用户名/组织slug
  avatar_url?: string;
}

// 列表页项目类型 - 精简版，用于项目列表展示
export type ProjectListItem = {
  id: string;
  type: string; // mod, resource_pack, data_pack, world, mod_pack, plugin, project, server
  slug: string;
  name: string; 
  summary: string;
  icon_url?: string;
  
  // 分类和标签
  category?: string;
  tags: string[];
  
  // 游戏兼容性
  game_versions: string[];
  loaders: string[];
  environment: string; // client, server, both
  
  // 项目属性
  status: string; // draft, published, archived, private
  is_open_source: boolean;
  license: string;
  
  // 所有者信息 - 简化版
  owner: ProjectOwner;
  
  // 统计信息
  download_count: number;
  follow_count: number;
  
  // 时间信息
  createdAt: string;
  updatedAt: string;
  published_at?: string;
  
  // 最新版本简要信息
  latest_version_number?: string;
  latest_version_id?: string;
}

// 详情页项目类型 - 完整版，包含所有详细信息
export type ProjectDetail = {
  id: string;
  type: string; // mod, resource_pack, data_pack, world, mod_pack, plugin, project, server; default: project
  slug: string; // 创建项目时填写
  name: string; // 显示名, 创建项目时填写
  summary: string; // 创建项目时填写 建议至少填写100个字符
  description?: string; // 详细描述，详情页才需要
  icon_url?: string;
  featured_gallery: string[]; // 图片库，详情页才需要
  
  // 分类和标签
  category?: string;
  tags: string[]; // 上传第一个版本后才可以选择或填写
  // mod: Adventure, Cursed, Decoration, Economy, Equipment, Food, 
  
  // 游戏兼容性
  game_versions: string[];
  loaders: string[];
  environment: string; // client, server, both
  
  // 项目属性
  status: string; // draft, published, archived, private
  visibility: string; // public, private, unlisted; default: public
  is_open_source: boolean;
  license: string;
  
  // 所有者信息
  owner: ProjectOwner;
  
  // 外部链接 - 详情页才需要
  source_url?: string;
  issues_url?: string;
  wiki_url?: string;
  discord_url?: string;
  
  // 统计信息
  download_count: number;
  follow_count: number;
  view_count: number; // 详情页才需要
  
  // 时间信息
  createdAt: string;
  updatedAt: string;
  published_at?: string;
  
  // 版本信息 - 详情页包含完整版本信息
  latest_version?: ProjectVersion;
  latest_version_id?: string;
  versions?: ProjectVersion[]; // 所有版本列表，详情页可能需要
  
  // 依赖信息 - 详情页才需要
  dependencies?: ProjectDependency[];
  
  // 成员信息 - 详情页才需要
  members?: ProjectMember[];
  
  // 评分信息 - 详情页才需要
  average_rating?: number;
  rating_count?: number;
  
  // 用户相关状态 - 详情页才需要
  user_follow?: boolean; // 当前用户是否关注
  user_bookmark?: boolean; // 当前用户是否收藏
  user_rating?: number; // 当前用户的评分
}

// 项目版本类型
export type ProjectVersion = {
  id: string;
  project_id: string;
  version_number: string;
  version_type: string; // release, beta, alpha
  name?: string;
  changelog?: string;
  
  // 兼容性
  game_versions: string[];
  loaders: string[];
  
  // 状态
  status: string;
  featured: boolean;
  
  // 统计
  download_count: number;
  
  // 作者
  author_id: string;
  author?: {
    id: string;
    name: string;
    username?: string;
    avatar_url?: string;
  };
  
  // 文件列表
  files?: ProjectFile[];
  
  // 时间
  createdAt: string;
  published_at?: string;
}

// 项目文件类型
export type ProjectFile = {
  id: string;
  version_id: string;
  filename: string;
  display_name?: string;
  file_type: string; // primary, additional, required, optional
  
  // 文件信息
  url: string;
  file_size: number;
  mime_type?: string;
  
  // 哈希
  sha1?: string;
  sha256?: string;
  
  // 统计
  download_count: number;
  
  createdAt: string;
}

// 项目依赖类型
export type ProjectDependency = {
  id: string;
  project_id: string;
  dependency_type: string; // required, optional, incompatible, embedded
  version_requirement?: string;
  
  // 内部依赖
  dependency_project?: {
    id: string;
    slug: string;
    name: string;
    icon_url?: string;
  };
  
  // 外部依赖
  external_url?: string;
  external_name?: string;
  
  createdAt: string;
}

// 项目成员类型
export type ProjectMember = {
  id: string;
  project_id: string;
  user: {
    id: string;
    name: string;
    username?: string;
    avatar_url?: string;
  };
  role: string; // owner, maintainer, contributor, viewer
  permissions: string[];
  status: string; // active, inactive, pending
  createdAt: string;
}

// 项目评论类型
export type ProjectComment = {
  id: string;
  project_id: string;
  user: {
    id: string;
    name: string;
    username?: string;
    avatar_url?: string;
  };
  content: string;
  parent_id?: string;
  status: string;
  is_pinned: boolean;
  like_count: number;
  reply_count: number;
  replies?: ProjectComment[];
  createdAt: string;
  updatedAt: string;
}

// 项目评分类型
export type ProjectRating = {
  id: string;
  project_id: string;
  user: {
    id: string;
    name: string;
    username?: string;
    avatar_url?: string;
  };
  rating: number; // 1-5
  review?: string;
  createdAt: string;
  updatedAt: string;
}

// 项目列表查询参数
export type ListProjectParams = {
  type: string;
  limit?: number;
  offset?: number;
  sort?: string; // relevance, download_count, follow_count, published_at, updatedAt
  keyword?: string; // 搜索关键字
  tags?: string[];
  game_versions?: string[]
  loaders?: string[];
  environment?: string; // client, server, both
  is_open_source?: boolean;
  sortDirection?: "asc" | "desc"
};

export type ClientListProjectParams = Omit<ListProjectParams, "offset"> & {
  page: number
}

// 项目列表响应类型 - 使用 ProjectListItem
export type ProjectListResponse = {
  records: ProjectListItem[];
  count: number;
  page?: number;
  totalPages?: number;
}

