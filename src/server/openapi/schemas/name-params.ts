import { z } from "@hono/zod-openapi";

const NameParamsSchema = z.object({
  name: z.string().min(1).max(32).openapi({
    param: {
      name: "name",
      in: "path",
      required: true,
    },
    required: ["name"],
    example: "我的 空格名字",
  }),
});

export default NameParamsSchema;