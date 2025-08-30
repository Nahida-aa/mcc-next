// import { createSubApp } from "@/server/createApp";
// import { requiredAuthMiddleware } from "@/server/apps/auth/middleware";
// import { createRoute } from "@hono/zod-openapi";
// import { z } from "@hono/zod-openapi";
// import { jsonContent, jsonContentRequest } from "@/server/apps/openapi/helpers/json-content";
// import { messageObjectSchema } from "@/server/apps/openapi/schemas/res";
// import { db } from "@/server/apps/admin/db";
// import { NotificationService } from '@/server/apps/project/member/service';
// import { HTTPResponseError, HttpError } from "@/server/apps/openapi/middlewares/on-error";
// import { IdUUIDParamsSchema } from "../../openapi/schemas/req";

// const app = createSubApp();

// // 获取用户通知列表
// const getUserNotificationsRoute = createRoute({
//   method: "get",
//   path: "/notifications",
//   middleware: [requiredAuthMiddleware] as const,
//   request: {
//     query: z.object({
//       isRead: z.boolean().optional(),
//       isImportant: z.boolean().optional(),
//       type: z.string().optional(),
//       page: z.number().min(1).default(1),
//       limit: z.number().min(1).max(100).default(20)
//     })
//   },
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         data: z.object({
//           notifications: z.array(z.any()),
//           total: z.number(),
//           page: z.number(),
//           limit: z.number(),
//           unreadCount: z.number()
//         })
//       }),
//       "获取通知列表成功"
//     ),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(getUserNotificationsRoute, async (c) => {
//   const session = c.get("session");
//   const query = c.req.valid("query");

//   try {
//     const result = await NotificationService.getUserNotifications(session.user.id, query);
    
//     return c.json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error('获取通知失败:', error);
//     throw new HTTPResponseError(500, '获取通知失败');
//   }
// });

// // 标记通知为已读
// const markNotificationAsReadRoute = createRoute({
//   method: "patch",
//   path: "/notifications/{id}/read",
//   middleware: [requiredAuthMiddleware] as const,
//   request: {
//     params: IdUUIDParamsSchema
//   },
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         message: z.string()
//       }),
//       "标记通知已读成功"
//     ),
//     404: jsonContent(messageObjectSchema(), "通知不存在"),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(markNotificationAsReadRoute, async (c) => {
//   const session = c.get("session");
//   const { id } = c.req.valid("param");

//   try {
//     await NotificationService.markAsRead(id, session.user.id);
    
//     return c.json({
//       success: true,
//       message: '通知已标记为已读'
//     });
//   } catch (error) {
//     console.error('标记通知已读失败:', error);
//     if (error instanceof Error && error.message === '通知不存在') {
//       throw new HTTPResponseError(404, '通知不存在');
//     }
//     throw new HTTPResponseError(500, '标记通知已读失败');
//   }
// });

// // 批量标记通知为已读
// const markNotificationsAsReadRoute = createRoute({
//   method: "patch",
//   path: "/notifications/read",
//   middleware: [requiredAuthMiddleware] as const,
//   request: {
//     body: jsonContent(
//       z.object({
//         notificationIds: z.array(z.string().uuid()).optional(),
//         markAll: z.boolean().default(false)
//       }),
//       "批量标记通知已读请求"
//     )
//   },
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         message: z.string(),
//         data: z.object({
//           markedCount: z.number()
//         })
//       }),
//       "批量标记通知已读成功"
//     ),
//     400: jsonContent(messageObjectSchema(), "请求参数错误"),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(markNotificationsAsReadRoute, async (c) => {
//   const session = c.get("session");
//   const { notificationIds, markAll } = c.req.valid("json");

//   try {
//     const markedCount = await NotificationService.markMultipleAsRead(
//       session.user.id, 
//       markAll ? undefined : notificationIds
//     );
    
//     return c.json({
//       success: true,
//       message: `已标记 ${markedCount} 条通知为已读`,
//       data: { markedCount }
//     });
//   } catch (error) {
//     console.error('批量标记通知已读失败:', error);
//     throw new HTTPResponseError(500, '批量标记通知已读失败');
//   }
// });

// // 删除通知
// const deleteNotificationRoute = createRoute({
//   method: "delete",
//   path: "/notifications/{id}",
//   middleware: [requiredAuthMiddleware] as const,
//   request: {
//     params: IdUUIDParamsSchema
//   },
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         message: z.string()
//       }),
//       "删除通知成功"
//     ),
//     404: jsonContent(messageObjectSchema(), "通知不存在"),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(deleteNotificationRoute, async (c) => {
//   const session = c.get("session");
//   const { id } = c.req.valid("param");

//   try {
//     await NotificationService.deleteNotification(id, session.user.id);
    
//     return c.json({
//       success: true,
//       message: '通知已删除'
//     });
//   } catch (error) {
//     console.error('删除通知失败:', error);
//     if (error instanceof Error && error.message === '通知不存在') {
//       throw new HTTPResponseError(404, '通知不存在');
//     }
//     throw new HTTPResponseError(500, '删除通知失败');
//   }
// });

// // 获取通知设置
// const getNotificationSettingsRoute = createRoute({
//   method: "get",
//   path: "/notifications/settings",
//   middleware: [requiredAuthMiddleware] as const,
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         data: z.any()
//       }),
//       "获取通知设置成功"
//     ),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(getNotificationSettingsRoute, async (c) => {
//   const session = c.get("session");

//   try {
//     const settings = await NotificationService.getUserSettings(session.user.id);
    
//     return c.json({
//       success: true,
//       data: settings
//     });
//   } catch (error) {
//     console.error('获取通知设置失败:', error);
//     throw new HTTPResponseError(500, '获取通知设置失败');
//   }
// });

// // 更新通知设置
// const updateNotificationSettingsRoute = createRoute({
//   method: "patch",
//   path: "/notifications/settings",
//   middleware: [requiredAuthMiddleware] as const,
//   request: {
//     body: jsonContent(
//       z.object({
//         emailNotifications: z.boolean().optional(),
//         pushNotifications: z.boolean().optional(),
//         projectInvites: z.boolean().optional(),
//         projectApplications: z.boolean().optional(),
//         projectUpdates: z.boolean().optional(),
//         mentions: z.boolean().optional(),
//         comments: z.boolean().optional(),
//         systemUpdates: z.boolean().optional()
//       }),
//       "更新通知设置请求"
//     )
//   },
//   responses: {
//     200: jsonContent(
//       z.object({
//         success: z.boolean(),
//         data: z.any(),
//         message: z.string()
//       }),
//       "更新通知设置成功"
//     ),
//     401: jsonContent(messageObjectSchema(), "未授权"),
//     500: jsonContent(messageObjectSchema(), "服务器内部错误")
//   }
// });

// app.openapi(updateNotificationSettingsRoute, async (c) => {
//   const session = c.get("session");
//   const body = c.req.valid("json");

//   try {
//     const settings = await NotificationService.updateUserSettings(session.user.id, body);
    
//     return c.json({
//       success: true,
//       data: settings,
//       message: '通知设置已更新'
//     });
//   } catch (error) {
//     console.error('更新通知设置失败:', error);
//     throw new HTTPResponseError(500, '更新通知设置失败');
//   }
// });

// export default app;
