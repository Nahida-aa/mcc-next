import { createRouter } from "@/lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
import { group as group_table } from "@/lib/db/schema/group";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import jsonContent from "@/lib/openapi/helpers/json-content";
import httpStatus from "@/lib/http-status-codes"
import { db } from "@/lib/db";
import createErrorSchema from "@/lib/openapi/schemas/create-error-schema";
import { get_current_user_and_res, get_session_token_payload, SessionTokenPayload } from "@/lib/middleware/auth";
import createMessageObjectSchema from "@/lib/openapi/schemas/create-message-object";
import { linkUserGroup } from "@/lib/db/schema/linkUserGroup";
import { user_meta_schema } from "@/lib/schema/user";
import { UserMeta } from "@/components/layout/sidebar/user-side-toggle";

const router = createRouter()

const group_selectSchema = createSelectSchema(group_table).extend({
  members: z.array(user_meta_schema.nullable())
})
const group_insertSchema = createInsertSchema(group_table).omit({id:true, creator_id: true, created_at: true, updated_at: true, followers_count: true})

router.openapi(createRoute({
  tags: ["group"],
  method: "post", path: "/groups",
  request: {
    body: jsonContent(group_insertSchema, "create group"),
  },
  responses: {
    [httpStatus.CREATED]: jsonContent(group_selectSchema, "created group"),
    [httpStatus.UNAUTHORIZED]: jsonContent(createMessageObjectSchema('Unauthorized'),'Unauthorized'),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(group_insertSchema),'The validation error(s); 验证错误'),
  },
}), async (c) => {
  const CU_ret = await get_current_user_and_res(c)
  if (!CU_ret.success) return c.json(CU_ret.json_body, CU_ret.status)
  const auth_user = CU_ret.user
  const in_group = c.req.valid("json")

  // const created_group_out = await auth_create_group(current_user_id, in_group)
  const created_group_out = await auth_create_group_outMembers(auth_user, in_group)
  return c.json(created_group_out, httpStatus.CREATED)
})

// 提取出 db 函数 api 函数 = 请求处理函数 + 数据库处理函数
export async function auth_create_group(auth_user_id: string, in_group: z.infer<typeof group_insertSchema>) {
  return await db.transaction(async (tx) => {
    const [db_group] = await tx.insert(group_table).values({...in_group, creator_id:auth_user_id}).returning()
    // 加入创建者到团队中(创建者是owner)
    await tx.insert(linkUserGroup).values({user_id: auth_user_id, group_id: db_group.id, role: 'owner'})
    return { ...db_group, members: [{id: auth_user_id}] }
  })
}

export async function auth_create_group_outMembers(auth_user: UserMeta, in_group: z.infer<typeof group_insertSchema>) {
  return await db.transaction(async (tx) => {
    const [db_group] = await tx.insert(group_table).values({...in_group, creator_id:auth_user.id}).returning()
    // 加入创建者到团队中(创建者是owner)
    await tx.insert(linkUserGroup).values({user_id: auth_user.id, group_id: db_group.id, role: 'owner'})
    return { ...db_group, members: [{id: auth_user.id, name: auth_user.name, image: auth_user.image, nickname: auth_user.nickname, email: auth_user.email}] }
  })
}

export default router