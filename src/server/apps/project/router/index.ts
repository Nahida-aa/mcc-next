import { createSubApp } from "@/server/createApp";
import { requiredAuthMiddleware } from "../../auth/middleware";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequest, resWith401 } from "@/server/apps/openapi/helpers/json-content";
import { messageObjectSchema } from "@/server/apps/openapi/schemas/res";
import { db } from "@/server/db";
import { user } from "@/server/apps/auth/table";

import { eq, and, like, desc } from "drizzle-orm";
import { AppError, HTTPResponseError } from "@/server/apps/openapi/middlewares/on-error";
import { createProject, getExistingProject, getProjectDetail, projectOwnerPermissions } from "../service";
import { generatePresignedUploadUrl, buildPublicUrl } from "@/server/apps/upload/r2-storage";
import { createSelectSchema } from "../../openapi/schemas/create";
import { project, projectMember } from "../table";
import { SlugUnicodeParamsSchema } from "../../openapi/schemas/req";
import { listProjectMember } from "../service/member";
import { createProjectResponseSchema, createProjectSchema, listUserSelfProjectQuerySchema, listUserSelfProjectResponseSchema, projectSelectSchema } from "../model";

const app = createSubApp();

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
})
app.openapi(getProjectRoute, async (c) => {
  const { slug } = c.req.valid('param');
  // 查找项目 - 使用 Select API
  const projectDetail = await getProjectDetail(slug);
  return c.json(projectDetail, 200);
});

app.use(requiredAuthMiddleware);

// 创建项目的路由
const createProjectRoute = createRoute({
  tags: ["project"], method: "post", path: "/project/create", description: "创建一个新的项目(mod、资源包、数据包等)",
  request: jsonContentRequest(createProjectSchema, "创建项目的请求数据"),
  responses: {
    200: jsonContent(createProjectResponseSchema, "项目创建成功"),
    400: jsonContent(messageObjectSchema("项目标识符已存在"), "请求错误"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    500: jsonContent(messageObjectSchema("创建项目失败"), "服务器错误")
  }
})
app.openapi(createProjectRoute, async (c) => {
  const session = c.var.session
  const data = c.req.valid('json');
  return c.json(await createProject(data, session.user.id), 200);
});

// 获取用户self项目列表的路由
const listUserSelfProjectRoute =createRoute({
  tags: ["project"], method: "get", path: "/user/projects", description: "获取当前用户的项目列表",
  request: {
    query: listUserSelfProjectQuerySchema,
  },
  responses: {
    200: jsonContent(listUserSelfProjectResponseSchema, "获取项目列表成功"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    500: jsonContent(messageObjectSchema("获取项目列表失败"), "服务器错误")
  }
});
app.openapi(listUserSelfProjectRoute, async (c) => {
  const session = c.var.session;
  const {limit, offset, type, status, visibility, search} = c.req.valid('query');

  // 构建查询条件 - 使用 Select API
  const conditions = [eq(project.ownerId, session.user.id)];
  
  if (type) {
    conditions.push(eq(project.type, type));
  }
  if (status) {
    conditions.push(eq(project.status, status));
  }
  if (visibility) {
    conditions.push(eq(project.visibility, visibility));
  }
  if (search) {
    conditions.push(like(project.name, `%${search}%`));
  }
  // 获取项目列表 - 使用 Select API
  const projects = await db
    .select({
      icon_url: project.iconUrl,
      id: project.id,
      type: project.type,
      slug: project.slug,
      name: project.name,
      status: project.status,
      visibility: project.visibility,
      download_count: project.downloadCount,
      follow_count: project.followCount,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })
    .from(project)
    .where(and(...conditions))
    .orderBy(desc(project.updatedAt))
    .limit(limit)
    .offset(offset);

  // 直接返回项目数组，匹配 z.array 的响应 schema
  return c.json(projects, 200);
});


export default app;