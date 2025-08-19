import { z } from "@hono/zod-openapi";
import { createSelectSchema } from "../../openapi/schemas/create";
import { project } from "@/server/db/schema";

// 创建项目需要: name*, slug*, visibility, summary*
export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[\w\u4e00-\u9fff-]+$/u, "slug 只能包含字母、数字、中文、连字符和下划线"),
  summary: z.string().min(1).max(500),
  visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
});
export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

// 创建项目的响应 schema
export const createProjectResponseSchema = z.object({
  id: z.string().openapi({ example: "abc123def456" }),
  slug: z.string().openapi({ example: "my-awesome-mod" }),
  name: z.string().openapi({ example: "我的模组" }),
  status: z.string().openapi({ example: "draft" }),
  createdAt: z.string().openapi({ example: "2024-01-01T00:00:00.000Z" })
});

// path参数 schema
export const typeAndSlugParamsSchema = z.object({
  type: z.enum(['mod', 'resource_pack', 'data_pack', 'shader', 'world', 'project']).openapi({ example: "project" }),
  slug: z.string().min(1, "项目标识符不能为空"),
});

export const projectSelectSchema = createSelectSchema(project);

// 获取项目self列表的查询参数 schema
export const listUserSelfProjectQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).optional().default(0),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  type: z.enum(['mod', 'resource_pack', 'data_pack', 'shader', 'world', 'project']).optional(),
  status: z.enum(['draft', 'processing', 'rejected', 'approved', 'archived', 'private']).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).optional(),
  search: z.string().optional(),
});
// 项目列表响应 schema
export const listUserSelfProjectResponseSchema = z.array(z.object({
  icon_url: z.string().nullable().openapi({ example: "https://example.com/icon.png" }),
  id: z.string().openapi({ example: "abc123def456" }),
  type: z.string().openapi({ example: "mod" }),
  slug: z.string().openapi({ example: "my-awesome-mod" }),
  name: z.string().openapi({ example: "我的模组" }),
  status: z.string().openapi({ example: "draft" }),
  visibility: z.string().openapi({ example: "public" }),
  download_count: z.number().openapi({ example: 0 }),
  follow_count: z.number().openapi({ example: 0 }),
  createdAt: z.string().openapi({ example: "2024-01-01T00:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2024-01-01T00:00:00.000Z" }).nullable(),
}));