import { createSubApp } from "@/api/create.app";
import { createRoute, z } from "@hono/zod-openapi";
import {jsonContent, jsonContentRequest, reqRes201, res201} from "@/server/openapi/helpers/json-content";
import { db } from "."

import { adminAuthMiddleware, optionalAuthMiddleware, requiredAuthMiddleware } from "../../auth/middleware";
import { AppErr } from "../../openapi/middlewares/on-error";
import { insertProjectMember, projectMemberInsertSchema, projectMemberSelectSchema, communityInsertSchema, communitySelectSchema, insertCommunity  } from "./service";

const app = createSubApp(adminAuthMiddleware)
.openapi(createRoute({
  tags: ["admin_db"], method: "post", path: "/project/member",
  ...reqRes201(projectMemberInsertSchema, z.array(projectMemberSelectSchema)),
}), async (c) => {
  return c.json(await insertProjectMember(db, c.req.valid("json")), 201);
})
.openapi(createRoute({
  tags: ["admin_db"], method: "post", path: "/community",
  request: jsonContentRequest(communityInsertSchema, 'insert data'),
  responses: res201(communitySelectSchema)
}), async (c) => {
  const [ret] = await insertCommunity(db, c.req.valid("json"))
  return c.json(ret, 201);
})

export default app;