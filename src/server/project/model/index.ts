import { z } from "@hono/zod-openapi";
import { createSelectSchema } from "../../openapi/schemas/create";
import { project } from "@/server/admin/db/schema";
import { projectUpdateSchema } from "../../admin/db/service";

// 创建项目需要: name*, slug*, visibility, summary*
export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[\w\u4e00-\u9fff-]+$/u, "slug 只能包含字母、数字、中文、连字符和下划线"),
  summary: z.string().min(1).max(500),
  visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
});
export type CreateProject = z.infer<typeof createProjectSchema>;

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


// 获取项目self列表的查询参数 schema
export const listUserSelfProjectQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
  type: z.enum(['mod', 'resource_pack', 'data_pack', 'shader', 'world', 'project']).optional(),
  status: z.enum(['draft', 'processing', 'rejected', 'approved', 'archived', 'private']).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).optional(),
  search: z.string().optional(),
});
export type ListUserSelfProjectQuery = z.infer<typeof listUserSelfProjectQuerySchema>;
// 项目列表响应 schema
export const listProjectQuerySchema = projectUpdateSchema.omit({
  visibility: true, summary: true, name: true, slug: true, description: true, updatedAt: true, createdAt: true, icon: true, discordUrl: true, downloadCount: true, followCount: true, viewCount: true,  ownerId: true, gallery: true, issuesUrl: true, publishedAt: true, sourceUrl: true, wikiUrl: true, latestVersionId: true, 
}).extend({
  limit: z.coerce.number().int().min(1).max(50).default(20).optional(),
  offset: z.coerce.number().int().min(0).default(0).optional(),
  orderBy: z.enum(['relevance', 'publishedAt', 'downloadCount', 'followCount', 'viewCount']).default('relevance').optional(),
  orderDir: z.enum(['asc', 'desc']).default('desc').optional(),
  q: z.string().optional(),
})
export type ListProjectQuery = z.infer<typeof listProjectQuerySchema>;

export const userSelfProjectSchema = z.object({
  icon: z.string().nullable().openapi({ example: "https://example.com/icon.png" }),
  id: z.string().openapi({ example: "abc123def456" }),
  type: z.string().openapi({ example: "mod" }),
  slug: z.string().openapi({ example: "my-awesome-mod" }),
  name: z.string().openapi({ example: "我的模组" }),
  status: z.string().openapi({ example: "draft" }),
  summary: z.string().openapi({ example: "这是一个很棒的模组" }),
  categories: z.array(z.string()),
  visibility: z.string().openapi({ example: "public" }),
  downloadCount: z.number().openapi({ example: 0 }),
  followCount: z.number().openapi({ example: 0 }),
  // createdAt: z.date().openapi({ example: "2024-01-01T00:00:00.000Z" }),
  updatedAt: z.date().openapi({ example: "2024-01-01T00:00:00.000Z" }).nullable(),
});

export type UserSelfProject = z.infer<typeof userSelfProjectSchema>;
export const listUserSelfProjectSchema = z.array(userSelfProjectSchema);
export type ListUserSelfProject = z.infer<typeof listUserSelfProjectSchema>;

