// import { createSubApp } from "@/server/createApp";
// import { requiredAuthMiddleware } from "@/server/apps/auth/middleware";
// import { createRoute } from "@hono/zod-openapi";
// import { z } from "@hono/zod-openapi";
// import { jsonContent, jsonContentRequest } from "@/server/apps/openapi/helpers/json-content";
// import { messageObjectSchema } from "@/server/apps/openapi/schemas/res";
// import { db } from "@/server/apps/admin/db";

// const app = createSubApp();

// // 创建申请的验证 schema
// const createApplicationRequestSchema = z.object({
//   projectId: z.string().uuid(),
//   message: z.string().min(10, '申请理由至少需要10个字符'),
//   requestedRole: z.string().default('member'),
//   requestedPermissions: z.array(z.string()).default([]),
//   portfolioUrls: z.array(z.string().url()).default([]),
//   experienceDescription: z.string().optional()
// });

// // 审核申请的验证 schema
// const reviewApplicationRequestSchema = z.object({
//   status: z.enum(['approved', 'rejected']),
//   reviewMessage: z.string().optional(),
//   finalRole: z.string().optional(),
//   finalPermissions: z.array(z.string()).optional()
// });

// // 创建项目成员申请
// const createApplicationRoute = createRoute({
//   method: "post",
//   path: "/applications",
//   middleware: [requiredAuthMiddleware] as const,
//   request: {
//     body: jsonContent(createApplicationRequestSchema, "创建申请请求")
//   },
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         data: z.any(),
//         message: z.string()
//       }),
//       "申请创建成功"
//     ),
//     400: jsonContent(messageObjectSchema(), "请求参数错误"),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(createApplicationRoute, async (c) => {
//   const session = c.get("session");
//   const body = c.req.valid("json");

//   try {
//     const application = await ProjectMemberApplicationService.createApplication({
//       ...body,
//       applicantId: session.user.id
//     });

//     return c.json({
//       success: true,
//       data: application,
//       message: '申请已提交'
//     });
//   } catch (error) {
//     console.error('创建申请失败:', error);
//     throw new HTTPResponseError(500, '创建申请失败');
//   }
// });

// // 获取用户的申请列表
// const getUserApplicationsRoute = createRoute({
//   method: "get",
//   path: "/applications/my",
//   middleware: [requiredAuthMiddleware] as const,
//   request: {
//     query: z.object({
//       status: z.enum(['pending', 'approved', 'rejected', 'cancelled']).optional()
//     })
//   },
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         data: z.array(z.any())
//       }),
//       "获取申请列表成功"
//     ),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(getUserApplicationsRoute, async (c) => {
//   const session = c.get("session");
//   const { status } = c.req.valid("query");

//   try {
//     const applications = await ProjectMemberApplicationService.getUserApplications(session.user.id, status);
    
//     return c.json({
//       success: true,
//       data: applications
//     });
//   } catch (error) {
//     console.error('获取申请失败:', error);
//     throw new HTTPResponseError(500, '获取申请失败');
//   }
// });

// // 获取项目的申请列表
// const getProjectApplicationsRoute = createRoute({
//   method: "get",
//   path: "/projects/{projectId}/applications",
//   middleware: [requiredAuthMiddleware] as const,
//   request: {
//     params: z.object({
//       projectId: z.string().uuid()
//     }),
//     query: z.object({
//       status: z.enum(['pending', 'approved', 'rejected', 'cancelled']).optional()
//     })
//   },
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         data: z.array(z.any())
//       }),
//       "获取项目申请列表成功"
//     ),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(getProjectApplicationsRoute, async (c) => {
//   const session = c.get("session");
//   const { projectId } = c.req.valid("param");
//   const { status } = c.req.valid("query");

//   // TODO: 检查用户是否有权限查看项目申请

//   try {
//     const applications = await ProjectMemberApplicationService.getProjectApplications(projectId, status);
    
//     return c.json({
//       success: true,
//       data: applications
//     });
//   } catch (error) {
//     console.error('获取项目申请失败:', error);
//     throw new HTTPResponseError(500, '获取项目申请失败');
//   }
// });

// // 审核申请
// const reviewApplicationRoute = createRoute({
//   method: "patch",
//   path: "/applications/{applicationId}/review",
//   middleware: [requiredAuthMiddleware] as const,
//   request: {
//     params: z.object({
//       applicationId: z.string().uuid()
//     }),
//     body: jsonContent(reviewApplicationRequestSchema, "审核申请请求")
//   },
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         data: z.any(),
//         message: z.string()
//       }),
//       "申请审核成功"
//     ),
//     400: jsonContent(messageObjectSchema(), "请求参数错误"),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(reviewApplicationRoute, async (c) => {
//   const session = c.get("session");
//   const { applicationId } = c.req.valid("param");
//   const body = c.req.valid("json");

//   try {
//     const application = await ProjectMemberApplicationService.reviewApplication({
//       ...body,
//       applicationId,
//       reviewerId: session.user.id
//     });
    
//     return c.json({
//       success: true,
//       data: application,
//       message: body.status === 'approved' ? '申请已批准' : '申请已拒绝'
//     });
//   } catch (error) {
//     console.error('审核申请失败:', error);
//     throw new HTTPResponseError(400, error instanceof Error ? error.message : '审核申请失败');
//   }
// });

// // 取消申请
// const cancelApplicationRoute = createRoute({
//   method: "delete",
//   path: "/applications/{applicationId}",
//   middleware: [requiredAuthMiddleware] as const,
//   request: {
//     params: z.object({
//       applicationId: z.string().uuid()
//     })
//   },
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         data: z.any(),
//         message: z.string()
//       }),
//       "申请取消成功"
//     ),
//     404: jsonContent(messageObjectSchema(), "申请不存在"),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(cancelApplicationRoute, async (c) => {
//   const session = c.get("session");
//   const { applicationId } = c.req.valid("param");

//   try {
//     const application = await ProjectMemberApplicationService.cancelApplication(applicationId, session.user.id);
    
//     if (!application) {
//       throw new HTTPResponseError(404, '申请不存在或无权限取消');
//     }

//     return c.json({
//       success: true,
//       data: application,
//       message: '申请已取消'
//     });
//   } catch (error) {
//     console.error('取消申请失败:', error);
//     if (error instanceof HTTPResponseError) {
//       throw error;
//     }
//     throw new HTTPResponseError(500, '取消申请失败');
//   }
// });

// export default app;
