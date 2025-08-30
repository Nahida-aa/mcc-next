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


import type { ZodIssue, ZodSchema } from "../helpers/types";

// https://github.com/w3cj/stoker/blob/main/src/openapi/schemas/create-error-schema.ts
export const validationErrorSchema = <
  T extends ZodSchema,
>(schema: T) => {
  const { error } = schema.safeParse(
    schema._def.type
    === "array"
      ? []
      : {},
  );
  const example = error
      ? {
        name: error.name,
        issues: error.issues.map((issue: ZodIssue) => ({
          code: issue.code,
          path: issue.path,
          message: issue.message,
        })),
      }
    : {
        name: "ZodError",
        issues: [
          {
            code: "invalid_type",
            path: ["fieldName"],
            message: "Expected string, received undefined",
          },
        ],
      };
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
        example,
      }),
  });
};

