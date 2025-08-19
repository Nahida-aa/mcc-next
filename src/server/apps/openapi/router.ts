// test openapi
import { createSubApp } from "@/server/createApp";
import { createRoute, z } from "@hono/zod-openapi"; // available
import {jsonContent} from "./helpers/json-content";
import * as httpStatusCodes from "@/server/apps/openapi/http-status-codes"; // 
import { messageObjectSchema } from "./schemas/res";

const subApp = createSubApp();

subApp.openapi(createRoute({
  tags: ["openapi"], method: "get", path: "/openapi",
  responses: {
    [httpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          })
        }
      },
      description: "test"
    }
  }
}),  (c) => {
  return c.json({ message: "test" }, httpStatusCodes.OK);
})

subApp.openapi(createRoute({
  tags: ["openapi"], method: "post", path: "/openapi",
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }), "test post"
    )
  }
}),  (c) => {
  return c.json({ message: "test" });
})

subApp.openapi(createRoute({
  tags: ["openapi"], method: "put", path: "/openapi",
  responses: {
    [httpStatusCodes.OK]: jsonContent(messageObjectSchema(),"test put")
  }
}),  (c) => {
  return c.json({ message: "test" });
})

export default subApp;