import { db } from "@/lib/db";
import { message_table, chat_table, link_chat_user_table } from "@/lib/db/schema/message";
import { user_table } from "@/lib/db/schema/user";
import { eq, and, sql, or, is, InferSelectModel, inArray, desc, gt, lt } from "drizzle-orm";
import { Chat_db, getChat, getOrCreate_chat } from "./chat";
import { exportPages } from "next/dist/export/worker";


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
      chat = await getOrCreate_chat(sender_id, target_id, content);
    } else {
      chat = await getChat(sender_id, target_id, target_type);
    }

    // 创建消息
    const [message] = await tx.insert(message_table).values({
      chat_id: chat.id,
      sender_id: sender_id,
      content: content,
    }).returning();

    return message
  });
}

export const listMessage_by_chatId = async (chat_id: string, offset: number, limit: number) => {
  const messagesQ = db.select().from(message_table)
    .where(eq(message_table.chat_id, chat_id)).orderBy(desc(message_table.created_at))
  const count = (await messagesQ).length
  const messages = await messagesQ.offset(offset).limit(limit);

  return { messages, count }
}

export const listMessageWithSender_by_chatId = async (chat_id: string, offset: number, limit: number) => {
  const messagesQ = db.select({
    id: message_table.id,
    chat_id: message_table.chat_id,
    sender_id: message_table.sender_id,
    content: message_table.content,
    created_at: message_table.created_at,
    sender: {
      id: user_table.id,
      name: user_table.name,
      nickname: user_table.nickname,
      image: user_table.image,
    }
  }).from(message_table)
    .leftJoin(user_table, eq(message_table.sender_id, user_table.id))
    .where(eq(message_table.chat_id, chat_id)).orderBy(desc(message_table.created_at))
  const count = (await messagesQ).length
  const messages = await messagesQ.offset(offset).limit(limit);

  return { messages, count }
}

interface CursorPaginationOptions {
  limit?: number;
  cursor?: {
    id: string;
    created_at: Date;
  };
}

export const listMessageWithSender_by_chatId_cursor = async (chat_id: string, options: CursorPaginationOptions = {}) => {
  const { limit = 30, cursor } = options;
  const items = await db.select({
    id: message_table.id,
    chat_id: message_table.chat_id,
    sender_id: message_table.sender_id,
    content: message_table.content,
    created_at: message_table.created_at,
    updated_at: message_table.updated_at,
    sender: {
      id: user_table.id,
      name: user_table.name,
      nickname: user_table.nickname,
      image: user_table.image,
    }
  }).from(message_table)
    .leftJoin(user_table, eq(message_table.sender_id, user_table.id))
    .where(and(
      eq(message_table.chat_id, chat_id),
      // 确保为您用于游标的列添加索引
      cursor
        ? or(
            lt(message_table.created_at, cursor.created_at),
            and(eq(message_table.created_at, cursor.created_at), lt(message_table.id, cursor.id)),
          )
        : undefined,
    )).limit(limit).orderBy(desc(message_table.created_at), desc(message_table.id))

  const next_cursor = items.length > 0 ? {
    id: items[items.length - 1].id,
    created_at: items[items.length - 1].created_at
  } : undefined

  return { items, next_cursor }
}


export const listPrivateChatMessages = async (user_id: string, target_id: string, offset: number, limit: number) => {
  const chat = await getChat(user_id, target_id, 'user');
  if (!chat) return { messages: [], count: 0 }

  return await listMessage_by_chatId(chat.id, offset, limit)
}
// export type ListPrivateChatMessages 
export type ListPrivateChatMessages = Awaited<ReturnType<typeof listPrivateChatMessages>>