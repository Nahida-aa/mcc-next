import { createSubApp } from "@/server/createApp";
import { createRoute, z } from "@hono/zod-openapi";
import {jsonContent, resWith401} from "@/server/apps/openapi/helpers/json-content";

import { requiredAuthMiddleware } from "@/server/apps/auth/middleware";
import { messageObjectSchema, validationErrorSchema } from "@/server/apps/openapi/schemas/res";
import { listNotification } from "./service";
import { reqQueryLimitAndOffset } from "../openapi/schemas/req";
import { notificationSchema } from "./model";


const app = createSubApp();
app.use(requiredAuthMiddleware)

app.openapi(createRoute({
  tags: ['notification'], method: "get",  path: "/notifications",
  request: {
    query: reqQueryLimitAndOffset,
  },
  responses: resWith401(z.array(notificationSchema), "List user notifications successfully"),
}), async (c) => {
    const userId = c.var.session.user.id;
    const { limit, offset } = c.req.valid("query");
    
    return c.json(await listNotification(userId, limit, offset), 200);

});

export default app;
