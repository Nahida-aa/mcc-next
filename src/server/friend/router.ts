import { createSubApp } from "@/api/create.app";
import { createRoute, z } from "@hono/zod-openapi";
import {jsonContent, jsonContentRequest, jsonContentResponseWith400_401_422, reqResWith400_401_422, resWith401} from "@/server/openapi/helpers/json-content";
import { 
  sendFriendRequest, 
  removeFriend, 
  listFriend,
} from "@/server/apps/friend/service";
import { requiredAuthMiddleware } from "@/server/auth/middleware";
import { messageObjectSchema, validationErrorSchema } from "@/server/openapi/schemas/res";
import { friendItemSchema, friendSelectSchema } from "./model";
import { IdUUIDParamsSchema } from "../openapi/schemas/req";


const friendIdSchema = z.object({
  friendId: z.string(),
});

const app = createSubApp();
app.use(requiredAuthMiddleware)


// 发送好友请求
app.openapi( createRoute({
  tags: ['friend'], method: "post", path: "/friend/{id}/request",
  request: {
    params: IdUUIDParamsSchema
  },
  responses: {
    200: jsonContent(friendSelectSchema, "Friend request sent successfully"),
    400: jsonContent(messageObjectSchema(), "Bad request"),
  }
}), async (c) => {
  const { id: targetId } = c.req.param()
  const authId = c.var.session.user.id
  
  if (authId === targetId) return c.json({ message: "Cannot send friend request to yourself" }, 400);
  
  const result = await sendFriendRequest(authId, targetId);
  return c.json(result, 200);
});


const listFriendRoute = createRoute({
  tags: ['friend'], method: "get", path: "/friends",
  responses: resWith401(z.array(friendItemSchema), "List friend successfully")
});
app.openapi(listFriendRoute, async (c) => {
    const authId = c.var.session.user.id
    const friends = await listFriend(authId);
    return c.json(friends, 200);
});


// // 删除好友
// const removeFriendResSchema = z.object({
//   success: z.boolean(),
//   data: z.object({
//     removed: z.boolean(),
//     deletedRecords: z.number(),
//   }),
//   message: z.string(),
// });
// const removeFriendRoute = createRoute({
//   tags: ['friend'], method: "post", path: "/friend/remove",
//   ...reqResWith400_401_422(removeFriendResSchema, "Remove friend successfully", friendIdSchema, "Request body for removing a friend"),
// });
// app.openapi(removeFriendRoute, async (c) => {
//   const userId = c.var.session.user.id
  
//   const result = await removeFriend(userId, friendId);
//   return c.json({
//     success: true,
//     data: result,
//     message: "Friend removed successfully"
//   }, 200);
// });

export default app;
