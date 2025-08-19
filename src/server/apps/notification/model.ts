import { notification } from "@/server/db/schema";
import { createSelectSchema } from "../openapi/schemas/create";
import { z } from "@hono/zod-openapi";
import { user } from "@heroui/react";
import { userBaseSchema } from "../auth/model";

export const notificationSelectSchema = createSelectSchema(notification);
export type NotificationSelect = typeof notification.$inferSelect;

export const notificationSchema = notificationSelectSchema.extend({
  isRead: z.boolean(),
  readAt: z.date().nullable(),
  sender: userBaseSchema.nullable()
});