// 输入输出模型 (zod schemas)
// 类型定义
import { z } from "@hono/zod-openapi";
import { user } from "@/server/admin/db/schema";

export type UserSelect = typeof user.$inferSelect;
export type UserBase = {
  id: string;
  username: string;
  displayUsername: string | null;
  image: string | null;
}
export const userBaseSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayUsername: z.string().nullable(),
  image: z.string().nullable(),
});