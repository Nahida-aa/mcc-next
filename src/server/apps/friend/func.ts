import { db } from "@/db";
import { follow, friend, user, notification } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { 
  createFollowNotification,
  createFriendRequestNotification,
  createFriendAcceptNotification,
  createFriendRejectNotification
} from "@/server/apps/notification/func"

/**
 * 发送好友请求
 * @param requesterId 请求者ID
 * @param targetId 目标用户ID
 * @returns 好友请求记录
 */
export async function sendFriendRequest(requesterId: string, targetId: string) {
  // 检查是否已经有好友关系或待处理的请求
  const existingFriend = await db
    .select()
    .from(friend)
    .where(or(
      and(eq(friend.userId, requesterId), eq(friend.friendId, targetId)),
      and(eq(friend.userId, targetId), eq(friend.friendId, requesterId))
    ))
    .limit(1);

  if (existingFriend.length > 0) {
    const status = existingFriend[0].status;
    if (status === "accepted") {
      throw new Error("Already friends with this user");
    } else if (status === "pending") {
      throw new Error("Friend request already sent or received");
    } else if (status === "rejected") {
      throw new Error("Friend request was rejected");
    } else if (status === "blocked") {
      throw new Error("Unable to send friend request");
    }
  }

  // 获取请求者信息用于通知
  const [requesterInfo] = await db
    .select({ name: user.name, displayUsername: user.displayUsername })
    .from(user)
    .where(eq(user.id, requesterId))
    .limit(1);

  // 创建好友请求（只创建一条记录，状态为pending）
  const friendRequestId = crypto.randomUUID();
  const [friendRequest] = await db
    .insert(friend)
    .values({
      id: friendRequestId,
      userId: targetId, // 接收请求的用户
      friendId: requesterId, // 发送请求的用户
      status: "pending",
      reason: "manual_request",
      requesterId: requesterId,
    })
    .returning();

  // 发送好友请求通知
  await createFriendRequestNotification(
    requesterId,
    targetId,
    requesterInfo?.displayUsername || requesterInfo?.name || '未知用户',
    friendRequestId
  );

  return friendRequest;
}

/**
 * 接受好友请求
 * @param requestId 好友请求ID
 * @param userId 当前用户ID（接受请求的用户）
 * @returns 更新后的好友关系
 */
export async function acceptFriendRequest(requestId: string, userId: string) {
  // 查找待处理的好友请求
  const [friendRequest] = await db
    .select()
    .from(friend)
    .where(and(
      eq(friend.id, requestId),
      eq(friend.userId, userId),
      eq(friend.status, "pending")
    ))
    .limit(1);

  if (!friendRequest) {
    throw new Error("Friend request not found or already processed");
  }

  const requesterId = friendRequest.requesterId;

  // 获取接受者信息用于通知
  const [accepterInfo] = await db
    .select({ name: user.name, displayUsername: user.displayUsername })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  // 更新现有请求状态为accepted
  await db
    .update(friend)
    .set({ 
      status: "accepted",
      updatedAt: new Date()
    })
    .where(eq(friend.id, requestId));

  // 创建反向好友关系
  await db
    .insert(friend)
    .values({
      id: crypto.randomUUID(),
      userId: requesterId,
      friendId: userId,
      status: "accepted",
      reason: "manual_request",
      requesterId: requesterId,
    });

  // 发送接受通知
  await createFriendAcceptNotification(
    userId,
    requesterId,
    accepterInfo?.displayUsername || accepterInfo?.name || '未知用户'
  );

  return { accepted: true };
}

/**
 * 拒绝好友请求
 * @param requestId 好友请求ID
 * @param userId 当前用户ID（拒绝请求的用户）
 * @returns 拒绝结果
 */
export async function rejectFriendRequest(requestId: string, userId: string) {
  // 查找待处理的好友请求
  const [friendRequest] = await db
    .select()
    .from(friend)
    .where(and(
      eq(friend.id, requestId),
      eq(friend.userId, userId),
      eq(friend.status, "pending")
    ))
    .limit(1);

  if (!friendRequest) {
    throw new Error("Friend request not found or already processed");
  }

  const requesterId = friendRequest.requesterId;

  // 获取拒绝者信息用于通知
  const [rejecterInfo] = await db
    .select({ name: user.name, displayUsername: user.displayUsername })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  // 更新请求状态为rejected
  await db
    .update(friend)
    .set({ 
      status: "rejected",
      updatedAt: new Date()
    })
    .where(eq(friend.id, requestId));

  // 发送拒绝通知
  await createFriendRejectNotification(
    userId,
    requesterId,
    rejecterInfo?.displayUsername || rejecterInfo?.name || '未知用户'
  );

  return { rejected: true };
}


/**
 * 删除好友
 * @param userId 用户ID
 * @param friendId 好友ID
 * @returns 删除结果
 */
export async function removeFriend(userId: string, friendId: string) {
  const deletedFriend = await db
    .delete(friend)
    .where(or(
      and(eq(friend.userId, userId), eq(friend.friendId, friendId)),
      and(eq(friend.userId, friendId), eq(friend.friendId, userId))
    ))
    .returning();

  if (deletedFriend.length === 0) {
    throw new Error("Not friends with this user");
  }

  return {
    removed: true,
    deletedRecords: deletedFriend.length,
  };
}

/**
 * 列出好友
 * @param userId 用户ID
 * @returns 好友列表
 */
export async function listFriends(userId: string) {
  return await db
    .select()
    .from(friend)
    .where(and(
      eq(friend.userId, userId),
      eq(friend.status, "accepted")
    ));
}

/**
 * 获取收到的好友请求列表
 * @param userId 用户ID
 * @returns 待处理的好友请求列表
 */
export async function getReceivedFriendRequests(userId: string) {
  return await db
    .select()
    .from(friend)
    .where(and(
      eq(friend.userId, userId),
      eq(friend.status, "pending")
    ));
}

/**
 * 获取发送的好友请求列表
 * @param userId 用户ID
 * @returns 已发送的好友请求列表
 */
export async function getSentFriendRequests(userId: string) {
  return await db
    .select()
    .from(friend)
    .where(and(
      eq(friend.requesterId, userId),
      eq(friend.status, "pending")
    ));
}

