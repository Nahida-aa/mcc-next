import { createSubApp } from "@/server/createApp";
import { requiredAuthMiddleware } from "../../auth/middleware";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { jsonContent } from "@/server/apps/openapi/helpers/json-content";
import { messageObjectSchema } from "@/server/apps/openapi/schemas/res";
import { IdUUIDParamsSchema } from "../../openapi/schemas/req";
import { inviteJoinProjectMemberSchema, projectMemberBaseSchema, projectMemberSchema, updateProjectMemberRoleSchema} from "../model/member";
import { inviteJoinProjectMember, listProjectMember,listProjectMemberBase,removeProjectMember,updateProjectMember } from "../service/member";

const app = createSubApp();
const listProjectMemberBaseRoute = createRoute({
  tags: ["project_member"], method: "get", path: "/projects/{id}/members/base",
  description: "获取指定项目的成员列表",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    200: jsonContent(z.array(projectMemberBaseSchema), "获取项目成员成功"),
    404: jsonContent(messageObjectSchema("项目不存在"), "项目未找到"),
    500: jsonContent(messageObjectSchema("获取项目成员失败"), "服务器错误")
  }
});
app.openapi(listProjectMemberBaseRoute, async (c) => {
  const { id } = c.req.valid('param');
  const members = await listProjectMemberBase(id);
  return c.json(members, 200);
});

app.use(requiredAuthMiddleware);

const inviteJoinProjectMemberRoute = createRoute({
  tags: ["project_member"], method: "post", path: "/projects/{id}/invite_member",
  description: "邀请用户或组织加入项目",
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContent(z.object({
      entityType: z.enum(['user', 'organization']), // TODO: 之后支持组织
      entityId: z.string(),
    }), "邀请成员的数据"),
  },
  responses: {
    200: jsonContent(inviteJoinProjectMemberSchema, "邀请成功"),
    403: jsonContent(messageObjectSchema("权限不足"), "无权限"),
    404: jsonContent(messageObjectSchema("项目不存在"), "项目未找到")
  }
});
app.openapi(inviteJoinProjectMemberRoute, async (c) => {
  const { id } = c.req.valid('param');
  const data = c.req.valid('json');
  const session = c.var.session;
  // 邀请成员
  const result = await inviteJoinProjectMember(session.user.id, id, data.entityId);

  return c.json(result, 200);
});

const listProjectMemberRoute = createRoute({
  tags: ["project_member"],
  method: "get", 
  path: "/projects/{id}/members", 
  description: "获取指定项目的成员列表",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    200: jsonContent(z.array(projectMemberSchema), "获取项目成员成功"),
    404: jsonContent(messageObjectSchema("项目不存在"), "项目未找到"),
    500: jsonContent(messageObjectSchema("获取项目成员失败"), "服务器错误")
  }
});
app.openapi(listProjectMemberRoute, async (c) => {
  const { id } = c.req.valid('param');
  const members = await listProjectMember(id);
  return c.json(members, 200);
});

const updateMemberRoute = createRoute({
  tags: ["project_member"],
  method: "patch",
  path: "/projects/{projectId}/members/{entityType}/{entityId}",
  description: "更新项目成员",
  request: {
    params: z.object({
      projectId: z.string(),
      entityType: z.enum(['user', 'organization']),
      entityId: z.string()
    }),
    body: jsonContent(updateProjectMemberRoleSchema, "更新角色的数据")
  },
  responses: {
    200: jsonContent(z.object({
      id: z.string(),
      role: z.string(),
      permissions: z.array(z.string())
    }), "角色更新成功"),
    403: jsonContent(messageObjectSchema("权限不足"), "无权限"),
    404: jsonContent(messageObjectSchema("成员不存在"), "成员未找到")
  }
});
app.openapi(updateMemberRoute, async (c) => {
  const { projectId, entityType, entityId } = c.req.valid('param');
  const data = c.req.valid('json');
  const session = c.var.session;

  const updatedMember = await updateProjectMember(projectId, entityType, entityId, data, session.user.id);
  return c.json(updatedMember, 200);
});

// 移除项目成员路由
const removeMemberRoute = createRoute({
  tags: ["project_member"],
  method: "delete",
  path: "/projects/{projectId}/members/{entityType}/{entityId}",
  description: "移除项目成员",
  request: {
    params: z.object({
      projectId: z.string(),
      entityType: z.enum(['user', 'organization']),
      entityId: z.string()
    })
  },
  responses: {
    200: jsonContent(z.object({ success: z.boolean() }), "成员移除成功"),
    403: jsonContent(messageObjectSchema("权限不足"), "无权限"),
    404: jsonContent(messageObjectSchema("成员不存在"), "成员未找到")
  }
});
app.openapi(removeMemberRoute, async (c) => {
  const { projectId, entityType, entityId } = c.req.valid('param');
  const session = c.var.session;

  const result = await removeProjectMember(projectId, entityType, entityId, session.user.id);
  return c.json(result, 200);
});

export default app;
