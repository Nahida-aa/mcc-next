import { z } from "@hono/zod-openapi";

export const messageObjectSchema = (exampleMessage: string = "Hello World") => {
  return z.object({
    message: z.string(),
  }).openapi({
    example: {
      message: exampleMessage,
    },
  });
};


import type { ZodSchema } from "../helpers/types.ts";

export const validationErrorSchema = <
  T extends ZodSchema,
>(schema: T) => {
  const { error } = schema.safeParse(
    schema._def.typeName
    === z.ZodFirstPartyTypeKind.ZodArray
      ? []
      : {},
  );
  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(
              z.union([z.string(), z.number()]),
            ),
            message: z.string().optional(),
          }),
        ),
        name: z.string(),
      })
      .openapi({
        example: error,
      }),
  });
};

