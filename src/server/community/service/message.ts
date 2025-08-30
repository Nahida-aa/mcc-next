import { and, eq } from "drizzle-orm";
import { db } from "../../admin/db";
import { channelMessage, userReadState } from "../table";
import { SendMsgInput } from "../model/message";

// TODO: 细节, logic
// 当 用户 进入 频道时，更新用户的最后阅读状态
export const onUserEnterChannel = async (userId: string, channelId: string, lastReadMessageId?: string) => {
  if (!lastReadMessageId) return
  const updated = await db
    .update(userReadState)
    .set({ lastReadMessageId })
    .where(and(eq(userReadState.userId, userId), eq(userReadState.channelId, channelId)))
    .returning({
      userId: userReadState.userId,
    });
  if (updated.length = 0) {
    await db.insert(userReadState).values({
      userId,
      channelId,
      lastReadMessageId,
    });
  }
}

// TODO: 细节, logic
// sendMessage ToChannel - 发送消息到频道
export const sendMsg = async (data: SendMsgInput) => {
  // 发送消息到频道
  const [newMessage] = await db.insert(channelMessage)
    .values(data)
    .returning();

  // 更新用户的最后阅读状态
  await onUserEnterChannel(data.userId, data.channelId, newMessage.id);

  return newMessage;
}