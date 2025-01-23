import { z } from "@hono/zod-openapi";

export const offset_limit_query_schema = z.object({
  offset: z.coerce.number().int().min(0).optional().default(0),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
})

export const offset_limit_query_schema_withQ = z.object({
  q: z.string().min(1),
  offset: z.coerce.number().int().min(0).optional().default(0),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
})