export type ProjectMeta = {
  type: string;
  slug: string;
  name: string;
  icon_url: string;
  summary: string;
  game_versions: string[];
  tags: string[];
  loaders: string[];
  environment: string;
  is_open_source: boolean;
  created_at: string;
  updated_at: string;
  license: string;
  creator: string;
  download_count: number;
  follow_count: number;
  latest_release_id: string;
}

// 项目列表查询参数
export type ListProjectParams = {
  type: string;
  limit?: number;
  offset?: number;
  sort?: string; // relevance, download_count, follow_count, published_at, updated_at
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

export type ProjectList = {
  records: ProjectMeta[];
  count: number;
}

