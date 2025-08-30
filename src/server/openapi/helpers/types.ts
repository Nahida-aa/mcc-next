import type { z } from "@hono/zod-openapi";

// eslint-disable-next-line 
// @ts-expect-error https://github.com/w3cj/stoker/blob/main/src/openapi/helpers/types.ts
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
export type ZodIssue = z.ZodIssue;