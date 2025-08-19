// create
import { createSchemaFactory } from 'drizzle-zod'
import { z } from '@hono/zod-openapi' // Extended Zod instance
export const { createSelectSchema, createInsertSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })