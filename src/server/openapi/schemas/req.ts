import { z } from "@hono/zod-openapi";

export const reqQueryLimitAndOffset = z.object({
  limit: z.coerce.number().optional().default(20),
  offset: z.coerce.number().optional().default(0),
});
export const reqQuerySearch = z.object({
  limit: z.coerce.number().optional().default(20),
  offset: z.coerce.number().optional().default(0),
  search: z.string().optional(),
});

export const IdParamsSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    example: 42,
  }),
});
export const IdUUIDParamsSchema = z.object({
  id: z.uuid().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    example: "4651e634-a530-4484-9b09-9616a28f35e3",
  }),
});

// Regular expression to validate slug format: alphanumeric, underscores, dashes, and Unicode characters
const slugUnicodeReg = /^[\w\p{L}\p{N}-]+$/u;
const SLUG_UNICODE_ERROR_MESSAGE = "Slug can only contain letters, numbers, dashes, underscores, and Unicode characters; Slug 只能包含字母、数字、-、_和 Unicode 字符";
export const SlugUnicodeParamsSchema = z.object({
  slug: z.string()
    .regex(slugUnicodeReg, SLUG_UNICODE_ERROR_MESSAGE)
    .openapi({
      param: {
        name: "slug",
        in: "path",
        required: true,
      },
      required: ["slug"],
      example: "我的-笔记",
    }),
});

export const uuidOrSlugParamsSchema = z.object({
  id: z.union([
    z.uuid().openapi({
      param: {
        name: "id",
        in: "path",
        required: true,
      },
      required: ["id"],
      example: "4651e634-a530-4484-9b09-9616a28f35e3",
    }),
    z.string()
      .regex(slugUnicodeReg, SLUG_UNICODE_ERROR_MESSAGE)
      .openapi({
        param: {
          name: "slug",
          in: "path",
          required: true,
        },
        required: ["slug"],
        example: "我的-笔记",
      }),
  ]),
});
