import { createRouter } from "~/lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
import { group_table } from "~/lib/db/schema/group";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import jsonContent from "~/lib/openapi/helpers/json-content";
import httpStatus from "~/lib/http-status-codes"
import { db } from "~/lib/db";
import createErrorSchema from "~/lib/openapi/schemas/create-error-schema";
import { get_current_user_and_res, get_session_token_payload, SessionTokenPayload } from "~/lib/middleware/auth";
import createMessageObjectSchema from "~/lib/openapi/schemas/create-message-object";
import { createDBProject } from "~/lib/db/q/project/create";
import { linkUserGroup } from "~/lib/db/schema/linkUserGroup";
import { eq, and } from "drizzle-orm";
import { listProjectByUser } from "~/lib/db/q/project/get";
import {  DBProjSchema } from "~/lib/db/schema/proj";

const router = createRouter()


const ListProjSchema = z.array(DBProjSchema)

router.openapi(createRoute({
  tags: ["project"], method: "get", path: "/project/by-user",
  request: {
  },
  responses: {
    [httpStatus.CREATED]: jsonContent(ListProjSchema, "list project"),
    [httpStatus.UNAUTHORIZED]: jsonContent(createMessageObjectSchema('Unauthorized'),'Unauthorized: 未登录'),
    [httpStatus.FORBIDDEN]: jsonContent(createMessageObjectSchema('Forbidden'),'Forbidden: 禁止的'),
    // [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(createProjectSchema),'The validation error(s); 验证错误'),
  },
}), async (c) => {
  const CU_ret = await get_current_user_and_res(c)
  if (!CU_ret.success) return c.json(CU_ret.json_body, CU_ret.status)
  const auth_user = CU_ret.user

  const list_project_out = await listProjectByUser(auth_user.id)

  return c.json(list_project_out, httpStatus.CREATED)
})


export default router