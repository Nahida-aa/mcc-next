import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import { json } from "stream/consumers";
import jsonContent from "../openapi/helpers/json-content";

const router = createRouter()

router.openapi(createRoute({
  tags: ['user'],
  path: '/users',
  method: 'get',
  responses: {
    200: jsonContent(
      z.array(z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      })),
      'List of user'
    )
  }
}), (c) => {
  return c.json([
    {
      id: '1',
      name: 'John Doe',
      email: 'email',
    },
  ])
})

export default router