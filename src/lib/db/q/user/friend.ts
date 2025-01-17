import { db } from "@/lib/db";
import { friend_table } from "@/lib/db/schema/follow";
import { friendNotification_table } from "@/lib/db/schema/notification";
import { eq, and, or, inArray } from "drizzle-orm";
import { chat_table } from "../../schema/message";
import { user_table } from "../../schema/user";

// 创建好友请求
export async function createFriendRequest(
  sender_id: string, receiver_id: string, content: string) {
  return await db.transaction(async (tx) => {
    // 检查是否已经存在好友请求或好友关系
    const existingRequest = await tx.select().from(friend_table)
      .where(and(eq(friend_table.user_id, sender_id),
        eq(friend_table.friend_id, receiver_id)))

    if (existingRequest) {
      throw new Error('好友请求已存在或已经是好友');
    }

    // 创建好友请求通知
    const [notification] = await tx.insert(friendNotification_table).values({
      type: 'request',
      content: content,
      receiver_id: receiver_id,
      sender_id: sender_id,
    }).returning();

    // 创建好友关系记录，状态为 'pending': 等待接受
    await tx.insert(friend_table).values({
      user_id: sender_id,
      friend_id: receiver_id,
      status: 'pending',
    });

    return notification;
  });
}

// 接受好友请求
export async function acceptFriendRequest(
  sender_id: string, receiver_id: string, content: string) {
  return await db.transaction(async (tx) => {
    // 更新好友关系状态为 'accepted': 已接受,公认的,认可的
    await tx.update(friend_table)
      .set({ status: 'accepted' })
      .where(and(
        eq(friend_table.user_id, receiver_id),
        eq(friend_table.friend_id, sender_id)));
    // 创建接受好友请求通知
    const [notification] = await tx.insert(friendNotification_table).values({
      type: 'accept',
      content: '好友请求已接受',
      receiver_id: sender_id,
      sender_id: receiver_id,
    }).returning();

    // 检查是否已经存在 Chat 记录
    const existingChats = await tx.select().from(chat_table)
    .where(or(
      and(
        eq(chat_table.user_id, sender_id),
        eq(chat_table.target_id, receiver_id),
        eq(chat_table.target_type, 'user')
      ),
      and(
        eq(chat_table.user_id, receiver_id),
        eq(chat_table.target_id, sender_id),
        eq(chat_table.target_type, 'user')
      )
    ))
    // 自动创建一个 Chat 记录
    if (!existingChats) {
      await tx.insert(chat_table).values([
        {
          user_id: sender_id,
          target_id: receiver_id,
          target_type: 'user',
          latest_message: "你们已经是好友了",
          latest_message_timestamp: new Date(),
          latest_message_count: 1,
        },
        {
          user_id: receiver_id,
          target_id: sender_id,
          target_type: 'user',
          latest_message: content,
          latest_message_timestamp: new Date(),
          latest_message_count: 1,
        }
      ]);
    }

    return notification;
  });
}

// 拒绝好友请求
export async function rejectFriendRequest(sender_id: string, receiver_id: string) {
  return await db.transaction(async (tx) => {
    // 更新好友关系状态为 'rejected'
    await tx.update(friend_table)
      .set({ status: 'rejected' })
      .where(and(
        eq(friend_table.user_id, receiver_id),
        eq(friend_table.friend_id, sender_id)))

    // 创建拒绝好友请求通知
    const [notification] = await tx.insert(friendNotification_table).values({
      type: 'reject',
      content: '好友请求已拒绝',
      receiver_id: sender_id,
      sender_id: receiver_id,
    }).returning();

    return notification;
  });
}

export const friendIdList_byUserId = async (user_id: string): Promise<string[]> => {
  const friends = await db.select({ friend_id: friend_table.friend_id })
    .from(friend_table)
    .where(eq(friend_table.user_id, user_id))
    .execute();

  return friends.map(friend => friend.friend_id);
}

export const userList_isFriend_byUserId = async (user_id: string, offset: number = 0, limit: number = 10) => {
  const friendIds = await friendIdList_byUserId(user_id);

  const users = await db.select().from(user_table)
    .where(inArray(user_table.id, friendIds))
    .offset(offset).limit(limit)

  return users;
}

export const userListWithCount_isFriend_byUserId = async (user_id: string, offset: number = 0, limit: number = 10) => {
  const friendIds = await friendIdList_byUserId(user_id);

  const usersQuery = db.select().from(user_table)
    .where(inArray(user_table.id, friendIds))

  const count = (await usersQuery).length
  const users = await usersQuery.offset(offset).limit(limit);

  return { users, count };
}