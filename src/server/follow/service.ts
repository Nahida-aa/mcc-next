import { db } from "@/server/admin/db";
import { follow, friend, user, notification, notificationReceiver } from "@/server/admin/db/schema";
import { eq, and, or } from "drizzle-orm";
import { buildNotificationInsert } from "../notification/service";
import { AppErr } from "../openapi/middlewares/on-error";
// import { 
//   createFollowNotification,
//   createFriendRequestNotification,
//   createFriendAcceptNotification,
//   createFriendRejectNotification
// } from "@/server/apps/notification/func";

// C
export const followUser = async (authId: string, targetId: string) => {
  return await db.transaction(async (tx) => {
    // main
    const [followItem] = await tx
      .insert(follow)
      .values({
        followerId: authId,
        targetId,
      })
      .returning();
    // send notification to target user
    const [newNotification] = await tx
      .insert(notification)
      .values(buildNotificationInsert("followed_user", authId, { targetId }))
      .returning();
    await tx.insert(notificationReceiver).values({
      notificationId: newNotification.id,
      userId: targetId,
    });
    // 检查 对方 是否也关注了 自己
    const mutualFollow = await tx
      .select()
      .from(follow)
      .where(and(
        eq(follow.followerId, targetId),
        eq(follow.targetId, authId)
      ))
      .limit(1);
    let friendshipCreated = false;
    if (mutualFollow.length > 0) {
      // 如果互相关注，自动成为好友
      await tx
        .insert(friend)
        .values({
          user1Id: authId,
          user2Id: targetId,
          status: "accepted",
          reason: "mutual_follow",
        });
    }
    return {
      followItem,
      friendshipCreated,
    };
  });
}

// R
export async function listFollowing(userId: string) {
  const followList = await db
    .select()
    .from(follow)
    .where(eq(follow.followerId, userId));
  return followList
}

export async function listFollowers(userId: string) {
  const followList = db
    .select()
    .from(follow)
    .where(eq(follow.targetId, userId));
  return followList;
}

export const getUserRelationship = async (userId: string, targetId: string) => {
  const [follows, friendRow] = await Promise.all([
    db.select({
      followerId: follow.followerId,
      targetId: follow.targetId,
    })
      .from(follow)
      .where(
        or(
          and(eq(follow.followerId, userId), eq(follow.targetId, targetId)),
          and(eq(follow.followerId, targetId), eq(follow.targetId, userId))
        )
      ),

    db.select({ id: friend.id })
      .from(friend)
      .where(
        and(
          or(
            and(eq(friend.user1Id, userId), eq(friend.user2Id, targetId)),
            and(eq(friend.user1Id, targetId), eq(friend.user2Id, userId))
          ),
          eq(friend.status, "accepted")
        )
      )
      .limit(1),
  ]);

  const isFollowing = follows.some(f => f.followerId === userId);
  const isFollower = follows.some(f => f.followerId === targetId);
  const isFriend = friendRow.length > 0;

  return {
    isFollowing,
    isFollower,
    isFriend,
    isMutualFollow: isFollowing && isFollower,
  };
};

// D
export async function unfollowUser(authId: string, targetId: string) {
  return await db.transaction(async (tx) => {
    // 删除关注记录
    const deletedFollow = await tx
      .delete(follow)
      .where(and(
        eq(follow.followerId, authId),
        eq(follow.targetId, targetId)
      ))
      .returning();

    if (deletedFollow.length === 0) throw AppErr(404, "Not following this user");

    // 如果因为互相关注而成为的好友关系，删除它
    await tx
      .delete(friend)
      .where(and(
        or(
          and(eq(friend.user1Id, authId), eq(friend.user2Id, targetId)),
          and(eq(friend.user1Id, targetId), eq(friend.user2Id, authId))
        ),
        eq(friend.reason, "mutual_follow")
      ));

  });
}