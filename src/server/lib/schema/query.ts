import { z } from "@hono/zod-openapi";

export const offset_limit_query_schema = z.object({
  offset: z.number().int().min(0).optional().default(0),
  limit: z.number().int().min(1).max(100).optional().default(30),
})