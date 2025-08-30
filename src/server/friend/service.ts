import { db } from "@/server/admin/db";
import { follow, friend, user, notification, notificationReceiver } from "@/server/admin/db/schema";
import { eq, and, or } from "drizzle-orm";
import { AppErr } from "../openapi/middlewares/on-error";
import { buildNotificationInsert } from "../notification/service";
import { UserBase } from "../../auth/model";
import { FriendItem } from "./model";




/**
 * 发送好友请求
 * @param requesterId 请求者ID
 * @param targetId 目标用户ID
 * @returns 好友请求记录
 */
export async function sendFriendRequest(senderId: string, targetId: string) {
  // 检查是否已经有好友关系或待处理的请求
  const existingFriend = await db
    .select()
    .from(friend)
    .where(or(
      and(eq(friend.user1Id, senderId), eq(friend.user2Id, targetId)),
      and(eq(friend.user1Id, targetId), eq(friend.user2Id, senderId))
    ))
    .limit(1);

  if (existingFriend.length > 0) {
    const status = existingFriend[0].status;
    if (status === "accepted") {
      throw AppErr(400, "Already friends with this user");
    } else if (status === "pending") {
      throw AppErr(400, "Friend request already sent or received");
    } else if (status === "rejected") {
      throw AppErr(400, "Friend request was rejected");
    } else if (status === "blocked") {
      throw AppErr(400, "Unable to send friend request");
    }
  }

  return await db.transaction(async (tx) => {
    // 创建好友请求（只创建一条记录，状态为pending）
    const [friendItem] = await tx
      .insert(friend)
      .values({
        user1Id: senderId, // 发送请求的用户
        user2Id: targetId, // 接收请求的用户
        status: "pending",
        reason: "manual_request",
      })
      .returning();
    const [newNotification] = await tx
      .insert(notification)
      .values(buildNotificationInsert("friend_request", senderId, { targetId, friendTableId: friendItem.id }))
      .returning();
    await tx.insert(notificationReceiver).values({
      notificationId: newNotification.id,
      userId: targetId,
    });
    return friendItem;
  });
};

export async function acceptFriendRequest(userId: string, senderId: string, friendTableId: string) {
  // 更新现有请求状态为accepted
  await db
    .update(friend)
    .set({ status: "accepted",})
    .where(and(
      eq(friend.id, friendTableId),
      eq(friend.status, "pending")
    ));
}

export async function rejectFriendRequest(userId: string, senderId: string, friendTableId: string) {

  // 更新请求状态为rejected
  await db.delete(friend).where(eq(friend.id, friendTableId));

  // 发送拒绝通知

}

// R
// get user for auth user 查看好友 详情
export const getUser = async (userId: string, authId:string) => {
  // TODO
  const users = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
};

export async function listFriend(authId: string): Promise<FriendItem[]> {
  // 查询所有已接受的好友关系，并关联用户信息
  const friends = await db
    .select({
      id: friend.id,
      user1Id: friend.user1Id,
      user2Id: friend.user2Id,
      user1: {
        id: user.id,
        username: user.username,
        displayUsername: user.displayUsername,
        image: user.image,
      },
      user2: {
        id: user.id,
        username: user.username, 
        displayUsername: user.displayUsername,
        image: user.image,
      }
    })
    .from(friend)
    .leftJoin(user, eq(friend.user1Id, user.id))
    .leftJoin(user, eq(friend.user2Id, user.id))
    .where(and(
      or(
        eq(friend.user1Id, authId),
        eq(friend.user2Id, authId)
      ),
      eq(friend.status, "accepted")
    ));

  // 转换为 Friend 类型，排除当前用户，只保留好友信息
  return friends ;
};

export const removeFriend = async (userId: string, authId: string) => {
  await db
    .delete(friend)
    .where(and(
      or(
        and(eq(friend.user1Id, userId), eq(friend.user2Id, authId)),
        and(eq(friend.user1Id, authId), eq(friend.user2Id, userId))
      ),
      eq(friend.status, "accepted")
    ))
}

