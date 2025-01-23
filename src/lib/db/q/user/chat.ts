import { db } from "@/lib/db";
import { chat_table, link_chat_user_table } from "@/lib/db/schema/message";
import { user_table } from "@/lib/db/schema/user";
import { eq, and, inArray, aliasedTable, or, not, InferSelectModel, sql } from "drizzle-orm";
import { group_table } from "../../schema/group";

export interface Chat {
  id: string;
  latest_message: string;
  latest_message_timestamp: Date;
  latest_sender_id: string;
  created_at: Date;
  type: string; // 'private' 或 'group'
  group_id: string | null;
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
export type ChatLs_userView = {
  chat: Chat;
  is_pinned: boolean | null;
  target_user: ChatTargetUser | null;
  target_group: ChatTargetGroup | null;
  latest_sender: ChatTargetUser | null;
}[]
export type ChatsWithCount = {
  chats: ChatLs_userView;
  count: number;
}
// 返回用户聊天列表的函数
export async function listChat_by_userId(currentUser_id: string, 
  offset: number = 0, limit: number=10
): Promise<ChatsWithCount> {
  try {
    const latestSender_table = aliasedTable(user_table, "latestSender_table")
    const chatsQ = db.select({ 
      chat: chat_table,
      is_pinned: link_chat_user_table.is_pinned,
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
      },
      latest_sender: {
        id: latestSender_table.id,
        name: latestSender_table.name,
        nickname: latestSender_table.nickname,
        image: latestSender_table.image,
      }
    }).from(chat_table)
    .leftJoin(link_chat_user_table, eq(chat_table.id, link_chat_user_table.chat_id))
    .leftJoin(user_table, eq(link_chat_user_table.target_user_id, user_table.id))
    .leftJoin(group_table, eq(link_chat_user_table.target_group_id, group_table.id))
    .leftJoin(latestSender_table, eq(chat_table.latest_sender_id, latestSender_table.id))
    .where(eq(link_chat_user_table.user_id, currentUser_id))
    .orderBy(chat_table.latest_message_timestamp)

    const count = (await chatsQ).length
    const chats = await chatsQ.offset(offset).limit(limit)

    return { chats, count }
  } catch (error) {
    console.error('Error in userChat_list:', error);
    throw error;
  }
}

export const createChat = async (
  type: string, 
  user_ids: string[],
  content: string,
  group_id?: string,
) => {
  return await db.transaction(async (tx) => {
    console.log('createChat', type, user_ids, content, group_id)
    console.log('latest_sender_id: ', user_ids[user_ids.length - 1])
    
    const [chat] = await tx.insert(chat_table).values({
      type: type,
      latest_message: content,
      latest_message_timestamp: sql`now()`,
      latest_sender_id: user_ids[user_ids.length - 1],
      group_id: group_id,
    }).returning();

    if (user_ids) {
      await tx.insert(link_chat_user_table).values(
        user_ids.map((user_id) => ({
          chat_id: chat.id,
          user_id: user_id,
          target_user_id: type === 'private' ? user_ids.find(id => id !== user_id) : null,
          target_group_id: type === 'group' ? group_id : null,
        }))
      );
    }

    return chat;
  });
}

export const getPrivateChat = async (user1_id: string, user2_id: string) => {
  const [chat] = await db.select().from(chat_table)
    .where(and(
      eq(chat_table.type, 'private'), // 确保是私聊
      inArray(chat_table.id, 
        db.select({chat_id: link_chat_user_table.chat_id})
          .from(link_chat_user_table)
          .where(eq(link_chat_user_table.user_id, user1_id))
      ),
      inArray(chat_table.id, 
        db.select({chat_id: link_chat_user_table.chat_id})
          .from(link_chat_user_table)
          .where(eq(link_chat_user_table.user_id, user2_id))
      )
    ))
    .limit(1);

  return chat;
}
export type Chat_db = InferSelectModel<typeof chat_table>;
// 抽取出 检查and创建聊天的逻辑 (only for private chat)
export async function getOrCreate_chat(
  sender_id: string, 
  target_id: string, 
  content: string,
): Promise<Chat_db> {
  let chat = await getPrivateChat(sender_id, target_id);
  if (chat) return chat
  
  return await createChat('private', [target_id, sender_id], content);
}

// 获取特定用户和目标之间的聊天会话
export const getChat = async(user_id: string, target_id: string, target_type: 'user' | 'group') => {
  const [chat] = await db.select({
    id: chat_table.id,
    latest_message: chat_table.latest_message,
    latest_message_timestamp: chat_table.latest_message_timestamp,
    latest_sender_id: chat_table.latest_sender_id,
    created_at: chat_table.created_at,
    type: chat_table.type,
    group_id: chat_table.group_id,
  }).from(chat_table)
    .leftJoin(link_chat_user_table, eq(chat_table.id, link_chat_user_table.chat_id))
    .where(and(
      // eq(chat_table.type, target_type),
      eq(link_chat_user_table.user_id, user_id),
      target_type === 'user'
        ? eq(link_chat_user_table.target_user_id, target_id)
        : eq(link_chat_user_table.target_group_id, target_id)
    ))
    .limit(1);

  return chat
}

export type ChatForDB = InferSelectModel<typeof chat_table>;
