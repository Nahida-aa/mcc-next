import { createRouter } from "@/lib/create-app"
import { acceptFriendRequest, createFriendRequest } from "@/lib/db/q/user/friend"
import { get_current_user_and_res } from "@/lib/middleware/auth"
import jsonContent from "@/lib/openapi/helpers/json-content"
import createMessageObjectSchema from "@/lib/openapi/schemas/create-message-object"
import { createRoute, z } from "@hono/zod-openapi"

const router = createRouter()

router.openapi(createRoute({
  tags: ['friend'],
  method: "post", path: "/user/add/friend/send_req",
  request: {
    body: jsonContent(
      z.object({
        receiver_id: z.string(),
        content: z.string().nullable().optional()
      }),
      'add friend send request'
    )
  },
  responses: {
    [200]: jsonContent(z.object({
    }), "当前用户的好友列表"),
    [401]: jsonContent(createMessageObjectSchema(), "Unauthorized: xxx"),
  }
}), async (c) => {
  const CU_ret = await get_current_user_and_res(c)
  if (!CU_ret.success) return c.json(CU_ret.json_body, 401)
  const auth_user = CU_ret.user
  const sender_id = auth_user.id
  let { receiver_id, content } = c.req.valid("json")
  if (!content) content = ''
    
  const notification = await createFriendRequest(sender_id, receiver_id, content)
  return c.json({}, 200)
})

router.openapi(createRoute({
  tags: ['friend'],
  method: "post", path: "/user/add/friend/accept_req",
  request: {
    body: jsonContent(
      z.object({
        sender_id: z.string(),
        content: z.string().nullable().optional()
      }),
      'add friend accept request'
    )
  },
  responses: {
    [200]: jsonContent(z.object({
    }), "当前用户的好友列表"),
    [401]: jsonContent(createMessageObjectSchema(), "Unauthorized: xxx"),
  }
}), async (c) => {
  const CU_ret = await get_current_user_and_res(c)
  if (!CU_ret.success) return c.json(CU_ret.json_body, 401)
  const auth_user = CU_ret.user
  const receiver_id = auth_user.id
  let { sender_id, content } = c.req.valid("json")
  if (!content) content = ''
  
  const notification = await acceptFriendRequest(sender_id, receiver_id, content)
  return c.json({}, 200)
})

export default router