import { createSubApp } from "@/server/createApp";
import { createRoute, z } from "@hono/zod-openapi";
import {jsonContent, jsonContentRequest, jsonContentResponseWith400_401_422, reqResWith400_401_422, resWith401} from "@/server/apps/openapi/helpers/json-content";
import { 
  sendFriendRequest, 
  removeFriend, 
  listFriends,
} from "@/server/apps/friend/func";
import { authMiddleware } from "@/server/apps/auth/middleware";
import { messageObjectSchema, validationErrorSchema } from "@/server/apps/openapi/schemas/res";


const friendIdSchema = z.object({
  friendId: z.string(),
});

const app = createSubApp();
app.use(authMiddleware)

const friendResSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string(),
    friendId: z.string(),
    reason: z.string().optional(),
  }),
  message: z.string(),
});
// 发送好友请求
app.openapi( createRoute({
  tags: ['friend'], method: "post", path: "/friend/request",
  ...reqResWith400_401_422(friendResSchema, "Send friend request successfully", friendIdSchema, "Request body for sending a friend request"),
}), async (c) => {
  try {
    const { friendId } = c.req.valid("json");
    const userId = c.var.session.user.id
    
    if (userId === friendId) return c.json({ message: "Cannot send friend request to yourself" }, 400);
    
    const result = await sendFriendRequest(userId, friendId);
    return c.json({
      success: true,
      data: result,
      message: "Friend request sent successfully"
    },200);
  } catch (error) {
    return c.json({ message: (error as Error).message }, 400);
  } 
});

// 删除好友
const removeFriendResSchema = z.object({
  success: z.boolean(),
  data: z.object({
    removed: z.boolean(),
    deletedRecords: z.number(),
  }),
  message: z.string(),
});
const removeFriendRoute = createRoute({
  tags: ['friend'], method: "post", path: "/friend/remove",
  ...reqResWith400_401_422(removeFriendResSchema, "Remove friend successfully", friendIdSchema, "Request body for removing a friend"),
});

app.openapi(removeFriendRoute, async (c) => {
  try {
    const { friendId } = c.req.valid("json");
    const userId = c.var.session.user.id
    
    const result = await removeFriend(userId, friendId);
    return c.json({
      success: true,
      data: result,
      message: "Friend removed successfully"
    }, 200);
  } catch (error) {
    return c.json({ message: (error as Error).message }, 400);
  }
});


// 获取好友列表
const listFriendResSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    status: z.string(),
    userId: z.string(),
    friendId: z.string(),
    reason: z.string(),
    requesterId: z.string(),
  })),
});
const listFriendRoute = createRoute({
  tags: ['friend'], method: "get", path: "/friends",
  responses: resWith401(listFriendResSchema, "List friend successfully")
});

app.openapi(listFriendRoute, async (c) => {
    const userId = c.var.session.user.id
    const friends = await listFriends(userId);
    return c.json({
      success: true,
      data: friends
    }, 200);
});



export default app;
