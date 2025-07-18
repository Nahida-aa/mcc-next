import { createSubApp } from "@/server/createApp";
import { createRoute, z } from "@hono/zod-openapi";
import {jsonContent, resWith401} from "@/server/apps/openapi/helpers/json-content";
import { 
  listUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from "@/server/apps/notification/func"
import { authMiddleware } from "@/server/apps/auth/middleware";
import { messageObjectSchema, validationErrorSchema } from "@/server/apps/openapi/schemas/res";

const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  title: z.string(),
  content: z.string(),
  relatedUserId: z.string().nullable(),
  relatedId: z.string().nullable(),
  isRead: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const app = createSubApp();
app.use(authMiddleware)
// 获取用户通知列表
const listUserNotificationsSchema = z.object({
  success: z.boolean(),
  data: z.array(notificationSchema),
});
app.openapi(createRoute({
  tags: ['notification'], method: "get",  path: "/notifications",
  request: {
    query: z.object({
      limit: z.string().optional().default("20"),
      offset: z.string().optional().default("0"),
    }),
  },
  responses: resWith401(listUserNotificationsSchema, "List user notifications successfully"),
}), async (c) => {
    const userId = c.var.session.user.id;
    const { limit, offset } = c.req.valid("query");
    
    const notifications = await listUserNotifications(
      userId, 
      parseInt(limit), 
      parseInt(offset)
    );
    
    return c.json({
      success: true,
      data: notifications
    }, 200);

});

// 获取未读通知数量
app.openapi(createRoute({
  tags: ['notification'], method: "get", path: "/notifications/unread-count",
  responses: {
    200: jsonContent(z.object({
      success: z.boolean(),
      count: z.number(),
    }), "Get unread notification count successfully"),
    401: jsonContent(messageObjectSchema(), "Unauthorized"),
  },
}), async (c) => {
    const userId = c.var.session.user.id;
    const count = await getUnreadNotificationCount(userId);
    
    return c.json({
      success: true,
      count
    }, 200);

});

// 标记通知为已读
app.openapi(createRoute({
  tags: ['notification'], method: "patch", path: "/notifications/{notificationId}/read",
  request: {
    params: z.object({
      notificationId: z.string(),
    }),
  },
  responses: {
    200: jsonContent(z.object({
      success: z.boolean(),
      data: notificationSchema,
    }), "Mark notification as read successfully"),
    401: jsonContent(messageObjectSchema(), "Unauthorized"),
    404: jsonContent(messageObjectSchema(), "Notification not found"),
  },
}), async (c) => {
  const userId = c.var.session.user.id;
  const { notificationId } = c.req.valid("param");
  
  const updatedNotification = await markNotificationAsRead(notificationId, userId);
  
  if (!updatedNotification) return c.json({ message: "Notification not found" }, 404);
  
  return c.json({
    success: true,
    data: updatedNotification
  }, 200);
});

// 标记所有通知为已读
app.openapi(createRoute({
  tags: ['notification'],  method: "patch", path: "/notifications/read-all",
  responses: {
    200: jsonContent(z.object({
      success: z.boolean(),
      count: z.number(),
    }), "Mark all notifications as read successfully"),
    401: jsonContent(messageObjectSchema(), "Unauthorized"),
  },
}), async (c) => {

    const userId = c.var.session.user.id;
    const updatedNotifications = await markAllNotificationsAsRead(userId);
    
    return c.json({
      success: true,
      count: updatedNotifications.length
    }, 200);

});

// 删除通知
app.openapi(createRoute({
  tags: ['notification'], method: "delete", path: "/notifications/{notificationId}",
  request: {
    params: z.object({
      notificationId: z.string(),
    }),
  },
  responses: {
    200: jsonContent(z.object({
      success: z.boolean(),
      message: z.string(),
    }), "Delete notification successfully"),
    401: jsonContent(messageObjectSchema(), "Unauthorized"),
    404: jsonContent(messageObjectSchema(), "Notification not found"),
  },
}), async (c) => {

    const userId = c.var.session.user.id;
    const { notificationId } = c.req.valid("param");
    
    const deletedNotification = await deleteNotification(notificationId, userId);
    
    if (!deletedNotification) {
      return c.json({ message: "Notification not found" }, 404);
    }
    
    return c.json({
      success: true,
      message: "Notification deleted successfully"
    }, 200);

});

export default app;
