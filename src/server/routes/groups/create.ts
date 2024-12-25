import { createRouter } from "@/server/lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
import { group as group_table } from "@/server/db/schema/group";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import jsonContent from "@/server/openapi/helpers/json-content";
import httpStatus from "@/server/lib/http-status-codes"
import { db } from "@/server/db";
import createErrorSchema from "@/server/openapi/schemas/create-error-schema";
import { get_session_token_payload, SessionTokenPayload } from "@/server/middleware/auth";
import createMessageObjectSchema from "@/server/openapi/schemas/create-message-object";
import { linkUserGroup } from "@/server/db/schema/linkUserGroup";
import { user_meta_schema } from "@/server/lib/schema/user";

const router = createRouter()

const group_selectSchema = createSelectSchema(group_table).extend({
  members: z.array(user_meta_schema.nullable())
})
const group_insertSchema = createInsertSchema(group_table).omit({id:true, creator_id: true, created_at: true, updated_at: true, followers_count: true})

router.openapi(createRoute({
  tags: ["group"],
  path: "/groups",
  method: "post",
  request: {
    body: jsonContent(group_insertSchema, "create group"),
  },
  responses: {
    [httpStatus.CREATED]: jsonContent(group_selectSchema, "created group"),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(group_insertSchema),'The validation error(s); 验证错误'),
    [httpStatus.UNAUTHORIZED]: jsonContent(createMessageObjectSchema('Unauthorized'),'Unauthorized'),
  },
}), async (c) => {
  let payload = null as SessionTokenPayload | null
  try {
    payload = await get_session_token_payload(c)
  } catch (error) {
    return c.json({ message: `Unauthorized: token可能被篡改`, error }, httpStatus.UNAUTHORIZED)
  } 
  if (!payload?.user?.id) {
    return c.json({ message: 'Unauthorized: 未登录' }, httpStatus.UNAUTHORIZED)
  }

  const current_user_id = payload.user.id
  const in_group = c.req.valid("json")

  const created_group_out = await db.transaction(async (tx) => {
  const [db_group] = await tx.insert(group_table).values({...in_group, creator_id:current_user_id}).returning()
    // 加入创建者到团队中(创建者是owner)
    await tx.insert(linkUserGroup).values({user_id: current_user_id, group_id: db_group.id, role: 'owner'})
    return { ...db_group, members: [payload.user] }
  })
  return c.json(created_group_out, httpStatus.CREATED)
})

export default router