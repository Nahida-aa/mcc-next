import { z } from "@hono/zod-openapi";

export const user_meta_schema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().nullable().optional(), // nullable -> 可以为 null, optional -> 可以不传(不传时为 undefined)
  image: z.string().nullable().optional(),
  nickname: z.string().nullable().optional(),
})