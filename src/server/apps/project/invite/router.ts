import { createSubApp } from "@/server/createApp";
import { requiredAuthMiddleware } from "@/server/apps/auth/middleware";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequest } from "@/server/apps/openapi/helpers/json-content";
import { messageObjectSchema } from "@/server/apps/openapi/schemas/res";
import { db } from "@/server/db";
import { ProjectMemberInviteService } from '@/server/apps/project/member/service';
import { HTTPResponseError, HttpError } from "@/server/apps/openapi/middlewares/on-error";
import { IdUUIDParamsSchema } from "../../openapi/schemas/req";

const app = createSubApp();

// 创建邀请的验证 schema
const createInviteRequestSchema = z.object({
  projectId: z.string().uuid(),
  email: z.string().email().optional(),
  username: z.string().min(1).optional(),
  message: z.string().optional(),
  role: z.string().default('member'),
  permissions: z.array(z.string()).default([]),
  expiresIn: z.number().min(1).max(24 * 30).default(24 * 7) // 最长30天，默认7天
}).refine(
  data => data.email || data.username,
  { message: "必须提供邮箱或用户名" }
);

// 响应邀请的验证 schema
const respondInviteRequestSchema = z.object({
  accept: z.boolean()
});

// 创建项目成员邀请
const createInviteRoute = createRoute({
  method: "post",
  path: "/invites",
  middleware: [requiredAuthMiddleware] as const,
  request: {
    body: jsonContent(createInviteRequestSchema, "创建邀请请求")
  },
  responses: {
    200: jsonContent(
      z.object({
        success: z.boolean(),
        data: z.any()
      }),
      "邀请创建成功"
    ),
    400: jsonContent(messageObjectSchema(), "请求参数错误"),
    401: jsonContent(messageObjectSchema(), "未授权"),
    500: jsonContent(messageObjectSchema(), "服务器内部错误")
  }
});

app.openapi(createInviteRoute, async (c) => {
  const session = c.get("session");
  const body = c.req.valid("json");

  try {
    const invite = await ProjectMemberInviteService.createInvite({
      ...body,
      inviterId: session.user.id
    });

    return c.json({
      success: true,
      data: invite
    });
  } catch (error) {
    console.error('创建邀请失败:', error);
    throw new HTTPResponseError(500, '创建邀请失败');
  }
});

// 获取用户收到的邀请
const getUserInvitesRoute = createRoute({
  method: "get",
  path: "/invites/received",
  middleware: [requiredAuthMiddleware] as const,
  request: {
    query: z.object({
      status: z.enum(['pending', 'accepted', 'rejected', 'expired', 'cancelled']).optional()
    })
  },
  responses: {
    200: jsonContent(
      z.object({
        success: z.boolean(),
        data: z.array(z.any())
      }),
      "获取邀请列表成功"
    ),
    401: jsonContent(messageObjectSchema(), "未授权"),
    500: jsonContent(messageObjectSchema(), "服务器内部错误")
  }
});

app.openapi(getUserInvitesRoute, async (c) => {
  const session = c.get("session");
  const { status } = c.req.valid("query");

  try {
    const invites = await ProjectMemberInviteService.getUserInvites(session.user.id, status);
    
    return c.json({
      success: true,
      data: invites
    });
  } catch (error) {
    console.error('获取邀请失败:', error);
    throw new HTTPResponseError(500, '获取邀请失败');
  }
});

// 响应邀请（接受/拒绝）
const respondInviteRoute = createRoute({
  method: "patch",
  path: "/invites/{id}/respond",
  middleware: [requiredAuthMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContent(respondInviteRequestSchema, "响应邀请请求")
  },
  responses: {
    200: jsonContent(
      z.object({
        success: z.boolean(),
        data: z.any(),
        message: z.string()
      }),
      "邀请响应成功"
    ),
    400: jsonContent(messageObjectSchema(), "请求参数错误"),
    401: jsonContent(messageObjectSchema(), "未授权"),
    500: jsonContent(messageObjectSchema(), "服务器内部错误")
  }
});

app.openapi(respondInviteRoute, async (c) => {
  const session = c.get("session");
  const { id } = c.req.valid("param");
  const { accept } = c.req.valid("json");

  try {
    const invite = await ProjectMemberInviteService.respondToInvite(id, session.user.id, accept);
    
    return c.json({
      success: true,
      data: invite,
      message: accept ? '邀请已接受' : '邀请已拒绝'
    });
  } catch (error) {
    console.error('响应邀请失败:', error);
    throw new HTTPResponseError(400, error instanceof Error ? error.message : '响应邀请失败');
  }
});

export default app;
