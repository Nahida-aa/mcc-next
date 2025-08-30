import { createSubApp } from "@/api/create.app";
import { requiredAuthMiddleware } from "../../auth/middleware";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequest, resWith401 } from "@/server/openapi/helpers/json-content";
import { messageObjectSchema } from "@/server/openapi/schemas/res";
import { user } from "@/server/auth/table";

import { eq, and, like, desc } from "drizzle-orm";
import { AppErr } from "@/server/openapi/middlewares/on-error";
import { createProject, getExistingProject, getProjectDetail, listUserProject } from "../service";
import { generatePresignedUploadUrl, buildPublicUrl } from "@/server/apps/upload/r2-storage";
import { createSelectSchema } from "../../openapi/schemas/create";
import { project, projectMember } from "../table";
import { SlugUnicodeParamsSchema } from "../../openapi/schemas/req";
import { listProjectMember } from "../service/member";
import { createProjectResponseSchema, createProjectSchema, listUserSelfProjectQuerySchema, listUserSelfProjectSchema } from "../model";
import { AppOpenAPI } from "@/server/types";
import { projectSelectSchema } from "../../admin/db/service";

const createProjectRoute = createRoute({
  tags: ["project"], method: "post", path: "/project/create", description: "创建一个新的项目(mod、资源包、数据包等)",
  request: jsonContentRequest(createProjectSchema, "创建项目的请求数据"),
  middleware: [requiredAuthMiddleware] as const, // Use `as const` to ensure TypeScript infers the middleware's Context.
  responses: {
    200: jsonContent(createProjectResponseSchema, "项目创建成功"),
    400: jsonContent(messageObjectSchema("项目标识符已存在"), "请求错误"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    500: jsonContent(messageObjectSchema("创建项目失败"), "服务器错误")
  }
})
const getProjectRoute = createRoute({
  tags: ["project"], method: "get", path: "/projects/{slug}", 
  description: "获取指定项目的详细信息",
  request: {
    params: SlugUnicodeParamsSchema,
  },
  responses: {
    200: jsonContent(projectSelectSchema, "获取项目详情成功"),
    400: jsonContent(messageObjectSchema("项目标识符无效"), "请求错误"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    404: jsonContent(messageObjectSchema("项目不存在"), "项目未找到"),
    500: jsonContent(messageObjectSchema("获取项目详情失败"), "服务器错误")
  }
});

// 获取用户self项目列表的路由
const listUserSelfProjectRoute =createRoute({
  tags: ["project"], method: "get", path: "/user/projects", description: "获取当前用户的项目列表",
  request: {
    query: listUserSelfProjectQuerySchema,
  },
  middleware: [requiredAuthMiddleware] as const,
  responses: {
    200: jsonContent(listUserSelfProjectSchema, "获取项目列表成功"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    500: jsonContent(messageObjectSchema("获取项目列表失败"), "服务器错误")
  }
});

const app = createSubApp()
.openapi(createProjectRoute, async (c) => {
  const session = c.var.session
  const data = c.req.valid('json');
  return c.json(await createProject(data, session.user.id), 200);
})
.openapi(getProjectRoute, async (c) => {
  const { slug } = c.req.valid('param');
  // 查找项目 - 使用 Select API
  const projectDetail = await getProjectDetail(slug);
  return c.json(projectDetail, 200);
})
.openapi(listUserSelfProjectRoute, async (c) => {
  const session = c.var.session;
  const query = c.req.valid('query');

  const projects = await listUserProject(session.user.id, query)
  // 直接返回项目数组，匹配 z.array 的响应 schema
  return c.json(projects, 200);
})

export default app;