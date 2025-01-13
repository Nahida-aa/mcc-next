import { db } from "@/server/db";
import { message_table, chat_table } from "@/server/db/schema/message";
import { user_table } from "@/server/db/schema/user";
import { eq, and, sql, or, is, InferSelectModel } from "drizzle-orm";

type Chat_db = InferSelectModel<typeof chat_table>;
// 抽取出 检查and创建聊天的逻辑
export async function getOrCreate_chat(
  sender_id: string, 
  target_id: string, 
  target_type: 'user' | 'group', 
  is_returning: boolean = true
): Promise<Chat_db> {
  return await db.transaction(async (tx) => {
    // 检查是否存在对应的聊天
    let [chat] = await tx.select().from(chat_table)
      .where(and(
        eq(chat_table.user_id, sender_id),
        eq(chat_table.target_id, target_id),
        eq(chat_table.target_type, target_type)
      ))

    if (!chat) {
      // 创建聊天
      if (is_returning) {
        [chat] = await tx.insert(chat_table).values({
          user_id: sender_id,
          target_id: target_id,
          target_type: target_type,
        }).returning();
      }else {
        await tx.insert(chat_table).values({
          user_id: sender_id,
          target_id: target_id,
          target_type: target_type,
        });
      }
    }

    return chat;
  });
}
// get chat
export async function getChat(
  user_id: string,
  target_id: string,
  target_type: 'user' | 'group'
) {
  const [chat] = await db.select().from(chat_table)
    .where(and(
      eq(chat_table.user_id, user_id),
      eq(chat_table.target_id, target_id),
      eq(chat_table.target_type, target_type)
    ))
  return chat
}
export async function sendMessage(
  sender_id: string,
  target_id: string,
  content: string,
  target_type: 'user' | 'group',
  createChat: boolean = true
) {
  return await db.transaction(async (tx) => {
    if (target_type === 'user' && sender_id === target_id) {
      throw new Error('不能给自己发消息');
    }
    let chat: Chat_db
    if (createChat){
      chat = await getOrCreate_chat(sender_id, target_id, target_type);
    } else {
      chat = await getChat(sender_id, target_id, target_type);
    }

    // 创建消息
    const [message] = await tx.insert(message_table).values({
      chat_id: chat.id,
      sender_id: sender_id,
      content: content,
    }).returning();

    // 为目标用户创建一条聊天记录
    await getOrCreate_chat(target_id, sender_id, 'user', false);

    return message
  });
}