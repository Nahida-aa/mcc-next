import { createSubApp } from "@/server/createApp";
import { auth } from "@/lib/auth";
import { createRoute } from "@hono/zod-openapi";
import {jsonContent} from "@/server/apps/openapi/helpers/json-content";
import { messageObjectSchema } from "@/server/apps/openapi/schemas/res";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";

const subApp = createSubApp();

subApp.openapi(createRoute({
  tags: ["auth"], method: "get", path: "/auth/test",
  responses: {
    200: jsonContent(messageObjectSchema(), "Test Auth OpenAPI endpoint") 
  }
}), async (c) => {
  const session = await auth.api.getSession(c.req.raw)
  console.log('Auth session:', session);
  return c.json({
    message: "Better Auth OpenAPI documentation is available at /api/auth/reference"
  });
});

subApp.get('/auth/llms.txt', async (c) => {
    // Get the OpenAPI document
    const openAPISchema = await auth.api.generateOpenAPISchema()
    const markdown = await createMarkdownFromOpenApi(openAPISchema)
    return c.text(markdown)
  })

subApp.on(["POST", "GET"], "/auth/*",  (c) => {
  return  auth.handler(c.req.raw);
});

// Better Auth 官方自己已经提供了 OpenAPI 文档路由 `${basePath}/reference` ==  /api/auth/reference



export default subApp;