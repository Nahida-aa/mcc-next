import { db } from "@/lib/db";
import { chat_table } from "@/lib/db/schema/message";
import { user_table } from "@/lib/db/schema/user";
import { eq, and } from "drizzle-orm";
import { group_table } from "../../schema/group";

export interface Chat {
  id: string;
  user_id: string;
  target_id: string;
  target_type: string; // 'user' or 'group'
  is_pinned: boolean;
  is_read: boolean;
  latest_message: string;
  latest_message_timestamp: Date;
  latest_message_count: number;
  created_at: Date;
}
export interface ChatTargetUser {
  id: string;
  name: string;
  nickname: string | null;
  image: string;
}
export interface ChatTargetGroup {
  id: string;
  name: string;
  image: string;
}

export type Chats = {
  chat: Chat;
  target_user: ChatTargetUser | null;
  target_group: ChatTargetGroup | null;
}[]
export type ChatsWithCount = {
  chats: Chats;
  count: number;
}
// 返回用户聊天列表的函数
export async function listChat_by_userId(user_id: string, 
  offset: number = 0, limit: number=10
): Promise<ChatsWithCount> {
  try {
    const chatsWithTargetQ = db.select({
      chat: chat_table,
      target_user: {
        id: user_table.id,
        name: user_table.name,
        nickname: user_table.nickname,
        image: user_table.image,
      },
      target_group: {
        id: group_table.id,
        name: group_table.name,
        image: group_table.image,
      }
    }).from(chat_table)
      .leftJoin(user_table, eq(chat_table.target_id, user_table.id)) // TODO: 可能会有问题, 且我知道如何解决
      .leftJoin(group_table, eq(chat_table.target_id, group_table.id))
      .where(eq(chat_table.user_id, user_id))
      .orderBy(chat_table.latest_message_timestamp)
    const count = (await chatsWithTargetQ).length
    const chats = await chatsWithTargetQ.offset(offset).limit(limit)

    return { chats, count }
  } catch (error) {
    console.error('Error in userChat_list:', error);
    throw error;
  }
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
