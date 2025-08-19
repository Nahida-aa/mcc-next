import { createSubApp } from "@/server/createApp";
import { createRoute, z } from "@hono/zod-openapi";
import {jsonContent, jsonContentRequest, jsonContentResponseWith400_401_422, reqResWith400_401_422} from "@/server/apps/openapi/helpers/json-content";
import { 
  followUser, 
  unfollowUser, 
  listFollowing, 
  listFollowers, 
  getUserRelationship 
} from "@/server/apps/follow/func";
import { requiredAuthMiddleware } from "@/server/apps/auth/middleware";
import { messageObjectSchema, validationErrorSchema } from "@/server/apps/openapi/schemas/res";

const followSchema = z.object({
  targetUserId: z.string(),
});

const app = createSubApp();
app.use(requiredAuthMiddleware)

// 关注用户
const followResSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  message: z.string(),
})
app.openapi(createRoute({
  tags: ['follow'], method: "post", path: "/follow", description: "Follow a user",
  // middleware: [requiredAuthMiddleware] as const,
  // request: {
  //   body: jsonContent(followSchema,"Request body for following a user"),
  // },
  // request: jsonContentRequest(followSchema, "Request body for following a user"),
  // responses: jsonContentResponseWith400_401_422(followResSchema,"Follow", followSchema),
  ...reqResWith400_401_422(followResSchema, "Follow user successfully", followSchema, "Request body for following a user"),
  // responses: {
  //   200: jsonContent(z.object({
  //     success: z.boolean(),
  //     data: z.any(),
  //     message: z.string(),
  //   }),"Follow user successfully"),
  //   400: jsonContent(messageObjectSchema(), "Bad request"),
  //   401: jsonContent(messageObjectSchema(), "Unauthorized"),
  //   422: jsonContent(validationErrorSchema(followSchema), "Schema Validation error"),
  // },
}), async (c) => {
  try {
    const { targetUserId } = c.req.valid("json");
    // 这里需要实现获取当前用户ID的逻辑，可以通过JWT token或session
    const userId = c.var.session.user.id
    c.var.logger.info(`User ${userId} is trying to follow user ${targetUserId}`);
    
    if (userId === targetUserId) {
      return c.json({ message: "Cannot follow yourself" }, 400);
    }

    const result = await followUser(userId, targetUserId);
    return c.json({
      success: true,
      data: result,
      message: result.friendshipCreated 
        ? "Followed successfully and became friends due to mutual follow"
        : "Followed successfully"
    }, 200);
  } catch (error) {
    return c.json({ message: (error as Error).message }, 400);
  }
});

// 取消关注
const unfollowUserSchema = z.object({
            success: z.boolean(),
            data: z.any(),
            message: z.string(),
          })

app.openapi(createRoute({
  tags: ['follow'], method: "post", path: "/unfollow",
  ...reqResWith400_401_422(unfollowUserSchema, "Unfollow user successfully", followSchema, "Request body for unfollowing a user"),
}), async (c) => {
  try {
    const { targetUserId } = c.req.valid("json")
    const userId = c.var.session.user.id
    
    const result = await unfollowUser(userId, targetUserId);
    return c.json({
      success: true,
      data: result,
      message: result.friendshipRemoved 
        ? "Unfollowed successfully and friendship removed"
        : "Unfollowed successfully"
    }, 200);
  } catch (error) {
    return c.json({ message: (error as Error).message }, 400);               
  }
});


// 关注列表
const listFollowingRoute = createRoute({
  tags: ['follow'], method: "get", path: "/following",
  responses: {
    200: jsonContent(z.object({
            success: z.boolean(),
            data: z.any(),
          }), "List following list successfully"),
  },
})
app.openapi(listFollowingRoute, async (c) => {
    const userId = c.var.session.user.id
    const following = await listFollowing(userId);
    return c.json({
      success: true,
      data: following
    });
});

// 粉丝列表
const listFollowersRoute = createRoute({
  tags: ['follow'], method: "get", path: "/followers",
  responses: {
    200: jsonContent(z.object({
            success: z.boolean(),
            data: z.any(),
          }), "List followers list successfully")
  },
});

app.openapi(listFollowersRoute, async (c) => {
    const userId = c.var.session.user.id
    const followers = await listFollowers(userId);
    return c.json({
      success: true,
      data: followers
    });

});


// 获取与特定用户的关系状态
const getRelationshipRoute = createRoute({
  tags: ['follow'], method: "get", path: "/relationship/{targetUserId}",
  request: {
    params: z.object({targetUserId: z.string()}),
  },
  responses: {
    200: jsonContent(z.object({
            success: z.boolean(),
            data: z.object({
              isFollowing: z.boolean(),
              isFollower: z.boolean(),
              isFriend: z.boolean(),
              isMutualFollow: z.boolean(),
            }),
          }), "List relationship status successfully"),
  },
});

app.openapi(getRelationshipRoute, async (c) => {
    const userId = c.var.session.user.id
    const { targetUserId } = c.req.valid("param");
    
    const relationship = await getUserRelationship(userId, targetUserId);
    return c.json({
      success: true,
      data: relationship
    });
});

export default app;
