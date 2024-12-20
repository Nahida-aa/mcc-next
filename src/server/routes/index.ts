import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import jsonContent from "../openapi/helpers/json-content";
import createMessageObjectSchema from "../openapi/schemas/create-message-object";

const router = createRouter()

router.openapi(createRoute({
  tags: ['test'],
  method: 'get',
  path: '/test',
  responses: {
    200: jsonContent(
      createMessageObjectSchema('Hello 200'),
      'Hello from index'
    )
  }
}), (c) => {
  return c.json({
    message: 'Hello 200'
  }, 200)
})

export default router