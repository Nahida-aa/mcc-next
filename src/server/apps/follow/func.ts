import { db } from "@/db";
import { follow, friend, user, notification } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { 
  createFollowNotification,
  createFriendRequestNotification,
  createFriendAcceptNotification,
  createFriendRejectNotification
} from "@/server/apps/notification/func";

/**
 * 关注用户
 * @param followerId 关注者ID
 * @param followingId 被关注者ID
 * @returns 关注记录和是否自动成为好友的状态
 */
export async function followUser(followerId: string, followingId: string) {
  // 检查是否已经关注
  const existingFollow = await db
    .select()
    .from(follow)
    .where(and(
      eq(follow.followerId, followerId),
      eq(follow.followingId, followingId)
    ))
    .limit(1);

  if (existingFollow.length > 0) {
    throw new Error("Already following this user");
  }

  // 获取关注者信息用于通知
  const [followerInfo] = await db
    .select({ name: user.name, displayUsername: user.displayUsername })
    .from(user)
    .where(eq(user.id, followerId))
    .limit(1);

  // 创建关注记录
  const [followRecord] = await db
    .insert(follow)
    .values({
      id: crypto.randomUUID(),
      followerId,
      followingId,
    })
    .returning();

  // 发送关注通知
  await createFollowNotification(
    followerId, 
    followingId, 
    followerInfo?.displayUsername || followerInfo?.name || '未知用户'
  );

  // 检查是否互相关注
  const mutualFollow = await db
    .select()
    .from(follow)
    .where(and(
      eq(follow.followerId, followingId),
      eq(follow.followingId, followerId)
    ))
    .limit(1);

  let friendshipCreated = false;

  // 如果互相关注，自动成为好友
  if (mutualFollow.length > 0) {
    // 检查是否已经是好友
    const existingFriend = await db
      .select()
      .from(friend)
      .where(or(
        and(eq(friend.userId, followerId), eq(friend.friendId, followingId)),
        and(eq(friend.userId, followingId), eq(friend.friendId, followerId))
      ))
      .limit(1);

    if (existingFriend.length === 0) {
      // 创建双向好友关系（互相关注自动成为好友，状态直接为accepted）
      await db.insert(friend).values([
        {
          id: crypto.randomUUID(),
          userId: followerId,
          friendId: followingId,
          status: "accepted",
          reason: "mutual_follow",
          requesterId: followerId, // 后关注的人作为请求者
        },
        {
          id: crypto.randomUUID(),
          userId: followingId,
          friendId: followerId,
          status: "accepted",
          reason: "mutual_follow",
          requesterId: followerId,
        },
      ]);
      friendshipCreated = true;
    }
  }

  return {
    followRecord,
    friendshipCreated,
  };
}

/**
 * 取消关注用户
 * @param followerId 关注者ID
 * @param followingId 被关注者ID
 * @returns 是否同时删除好友关系
 */
export async function unfollowUser(followerId: string, followingId: string) {
  // 删除关注记录
  const deletedFollow = await db
    .delete(follow)
    .where(and(
      eq(follow.followerId, followerId),
      eq(follow.followingId, followingId)
    ))
    .returning();

  if (deletedFollow.length === 0) {
    throw new Error("Not following this user");
  }

  // 检查是否有因为互相关注而自动成为的好友关系
  const mutualFriend = await db
    .select()
    .from(friend)
    .where(and(
      or(
        and(eq(friend.userId, followerId), eq(friend.friendId, followingId)),
        and(eq(friend.userId, followingId), eq(friend.friendId, followerId))
      ),
      eq(friend.reason, "mutual_follow")
    ));

  let friendshipRemoved = false;

  // 如果存在因为互相关注而成为的好友关系，删除它
  if (mutualFriend.length > 0) {
    await db
      .delete(friend)
      .where(and(
        or(
          and(eq(friend.userId, followerId), eq(friend.friendId, followingId)),
          and(eq(friend.userId, followingId), eq(friend.friendId, followerId))
        ),
        eq(friend.reason, "mutual_follow")
      ));
    friendshipRemoved = true;
  }

  return {
    unfollowed: true,
    friendshipRemoved,
  };
}



/**
 * 获取用户的关注列表
 * @param userId 用户ID
 * @returns 关注的用户列表
 */
export async function listFollowing(userId: string) {
  return await db
    .select()
    .from(follow)
    .where(eq(follow.followerId, userId));
}

/**
 * 获取用户的粉丝列表
 * @param userId 用户ID
 * @returns 关注该用户的用户列表
 */
export async function listFollowers(userId: string) {
  return await db
    .select()
    .from(follow)
    .where(eq(follow.followingId, userId));
}


/**
 * 检查用户关系状态
 * @param userId 用户ID
 * @param targetUserId 目标用户ID
 * @returns 关系状态
 */
export async function getUserRelationship(userId: string, targetUserId: string) {
  const [isFollowing, isFollower, isFriend] = await Promise.all([
    db.select().from(follow).where(and(
      eq(follow.followerId, userId),
      eq(follow.followingId, targetUserId)
    )).limit(1),
    db.select().from(follow).where(and(
      eq(follow.followerId, targetUserId),
      eq(follow.followingId, userId)
    )).limit(1),
    db.select().from(friend).where(and(
      eq(friend.userId, userId),
      eq(friend.friendId, targetUserId),
      eq(friend.status, "accepted")
    )).limit(1),
  ]);

  return {
    isFollowing: isFollowing.length > 0,
    isFollower: isFollower.length > 0,
    isFriend: isFriend.length > 0,
    isMutualFollow: isFollowing.length > 0 && isFollower.length > 0,
  };
}
