import { db } from "@/db";
import { notification } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type NotificationType = 'follow' | 'friend_request' | 'friend_accept' | 'friend_reject' | 'system';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  relatedUserId?: string;
  relatedId?: string;
}

/**
 * 创建通知
 */
export async function createNotification(params: CreateNotificationParams) {
  const [notificationRecord] = await db
    .insert(notification)
    .values({
      id: crypto.randomUUID(),
      ...params,
    })
    .returning();

  return notificationRecord;
}

/**
 * 获取用户的通知列表
 */
export async function listUserNotifications(userId: string, limit = 20, offset = 0) {
  return await db
    .select()
    .from(notification)
    .where(eq(notification.userId, userId))
    .orderBy(desc(notification.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * 获取用户未读通知数量
 */
export async function getUnreadNotificationCount(userId: string) {
  const result = await db
    .select({ count: notification.id })
    .from(notification)
    .where(and(
      eq(notification.userId, userId),
      eq(notification.isRead, false)
    ));
  
  return result.length;
}

/**
 * 标记通知为已读
 */
export async function markNotificationAsRead(notificationId: string, userId: string) {
  const [updatedNotification] = await db
    .update(notification)
    .set({ 
      isRead: true,
      updatedAt: new Date()
    })
    .where(and(
      eq(notification.id, notificationId),
      eq(notification.userId, userId)
    ))
    .returning();

  return updatedNotification;
}

/**
 * 标记所有通知为已读
 */
export async function markAllNotificationsAsRead(userId: string) {
  const updatedNotifications = await db
    .update(notification)
    .set({ 
      isRead: true,
      updatedAt: new Date()
    })
    .where(and(
      eq(notification.userId, userId),
      eq(notification.isRead, false)
    ))
    .returning();

  return updatedNotifications;
}

/**
 * 删除通知
 */
export async function deleteNotification(notificationId: string, userId: string) {
  const [deletedNotification] = await db
    .delete(notification)
    .where(and(
      eq(notification.id, notificationId),
      eq(notification.userId, userId)
    ))
    .returning();

  return deletedNotification;
}

/**
 * 创建关注通知
 */
export async function createFollowNotification(followerId: string, followingId: string, followerName: string) {
  return await createNotification({
    userId: followingId,
    type: 'follow',
    title: '新的关注者',
    content: `${followerName} 开始关注你了`,
    relatedUserId: followerId,
  });
}

/**
 * 创建好友请求通知
 */
export async function createFriendRequestNotification(
  requesterId: string, 
  targetId: string, 
  requesterName: string,
  friendRequestId: string
) {
  return await createNotification({
    userId: targetId,
    type: 'friend_request',
    title: '新的好友请求',
    content: `${requesterName} 想要添加你为好友`,
    relatedUserId: requesterId,
    relatedId: friendRequestId,
  });
}

/**
 * 创建好友请求接受通知
 */
export async function createFriendAcceptNotification(
  accepterId: string, 
  requesterId: string, 
  accepterName: string
) {
  return await createNotification({
    userId: requesterId,
    type: 'friend_accept',
    title: '好友请求已接受',
    content: `${accepterName} 接受了你的好友请求`,
    relatedUserId: accepterId,
  });
}

/**
 * 创建好友请求拒绝通知
 */
export async function createFriendRejectNotification(
  rejecterId: string, 
  requesterId: string, 
  rejecterName: string
) {
  return await createNotification({
    userId: requesterId,
    type: 'friend_reject',
    title: '好友请求已拒绝',
    content: `${rejecterName} 拒绝了你的好友请求`,
    relatedUserId: rejecterId,
  });
}
