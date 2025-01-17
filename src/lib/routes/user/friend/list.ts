import { createRouter } from "@/lib/create-app";
import { userList_onlyNotFriend_byWord_currentUserID, userListWithCount_onlyNotFriend_byWord_currentUserID } from "@/lib/db/q/qUser";
import { userListWithCount_isFriend_byUserId } from "@/lib/db/q/user/friend";
import { get_current_user_and_res } from "@/lib/middleware/auth";
import jsonContent from "@/lib/openapi/helpers/json-content";
import createMessageObjectSchema from "@/lib/openapi/schemas/create-message-object";
import { offset_limit_query_schema, offset_limit_query_schema_withQ } from "@/lib/schema/query";
import { user_meta_schema } from "@/lib/schema/user";
import { createRoute, z } from "@hono/zod-openapi";

const router = createRouter()

router.openapi(createRoute({
  tags: ['friend'],
  method: "get", path: "/user/list/is_friend",
  request: {
    query: offset_limit_query_schema,
  },
  responses: {
    [200]: jsonContent(z.object({
      users: z.array(user_meta_schema),
      count: z.number()
    }), "当前用户的好友列表"),
    [401]: jsonContent(createMessageObjectSchema(), "Unauthorized: xxx"),
  }
}), async (c) => {
    const CU_ret = await get_current_user_and_res(c)
    if (!CU_ret.success) return c.json(CU_ret.json_body, 401)
    const auth_user = CU_ret.user
    const {  offset, limit } = c.req.valid("query")

    const {users, count} = await userListWithCount_isFriend_byUserId(auth_user.id, offset, limit)
    return c.json({users, count}, 200)
})

router.openapi(createRoute({
  tags: ['friend'],
  method: "get", path: "/user/list/not_friend",
  request: {
    query: offset_limit_query_schema_withQ,
  },
  responses: {
    [200]: jsonContent(z.object({
      users: z.array(user_meta_schema),
      count: z.number()
    }), "想要添加好友时搜索的结果列表"),
    [401]: jsonContent(createMessageObjectSchema(), "Unauthorized: xxx"),
  }
}), async (c) => {
    const CU_ret = await get_current_user_and_res(c)
    if (!CU_ret.success) return c.json(CU_ret.json_body, 401)
    const auth_user = CU_ret.user
    const { q, offset, limit } = c.req.valid("query")

    const {users, count} = await userListWithCount_onlyNotFriend_byWord_currentUserID(auth_user.id, q, offset, limit)
    return c.json({users, count}, 200)
})

export default router