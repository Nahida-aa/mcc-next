import { z } from "@hono/zod-openapi";

export const reqQueryLimitAndOffset = z.object({
  limit: z.string().optional().default("20"),
  offset: z.string().optional().default("0"),
});