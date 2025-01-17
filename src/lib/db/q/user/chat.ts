import { db } from "@/lib/db";
import { chat_table } from "@/lib/db/schema/message";
import { user_table } from "@/lib/db/schema/user";
import { eq, and } from "drizzle-orm";
import { group_table } from "../../schema/group";

export interface ChatTarget {
  id: string;
  name: string;
  image: string;
}

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
  // target_user?: ChatTarget // 这个是 js(ts) 的语法(undefine)，sql 里面是不直接支持的
  target_user: ChatTarget | null;
  target_group: ChatTarget | null;
}
// 返回用户聊天列表的函数
export async function chatList_by_userId(user_id: string): Promise<Chat[]> {
  try {
    const chats = await db.select({
      id: chat_table.id,
      user_id: chat_table.user_id,
      target_id: chat_table.target_id,
      target_type: chat_table.target_type, // 'user' or 'group'
      is_pinned: chat_table.is_pinned,
      is_read: chat_table.is_read,
      latest_message: chat_table.latest_message,
      latest_message_timestamp: chat_table.latest_message_timestamp,
      latest_message_count: chat_table.latest_message_count,
      created_at: chat_table.created_at,
      target_user: {
        id: user_table.id,
        name: user_table.name,
        image: user_table.image,
      },
      target_group: {
        id: group_table.id,
        name: group_table.name,
        image: group_table.image,
      }
    }).from(chat_table)
      .leftJoin(user_table, eq(chat_table.target_id, user_table.id))
      .leftJoin(group_table, eq(chat_table.target_id, group_table.id))
      .where(eq(chat_table.user_id, user_id))
      .orderBy(chat_table.latest_message_timestamp)

    return chats
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
