
import { get_current_user_and_res } from "@/lib/middleware/auth"
import { sendMessage } from "@/lib/db/q/user/msg"
import { db } from "@/lib/db"
import { eq, and, sql, or, is, InferSelectModel } from "drizzle-orm"
import { message_table, chat_table } from "@/lib/db/schema/message"
import { user_table } from "@/lib/db/schema/user"
import httpStatus from "@/lib/http-status-codes"
import { createRouter } from "@/lib/create-app"
import { createRoute, z } from "@hono/zod-openapi"
import jsonContent from "@/lib/openapi/helpers/json-content"
import createMessageObjectSchema from "@/lib/openapi/schemas/create-message-object"
import { send } from "process"

const router = createRouter()

router.openapi(createRoute({
  tags: ["chats"], description: `Send a message`,
  method: "post", path: "/chats/messages",
  request: {
    body: jsonContent(z.object({
      target_id: z.string(),
      content: z.string(),
      target_type: z.enum(['user', 'group']),
    }), "Send message")
  },
  responses: {
    [httpStatus.CREATED]: jsonContent(z.object({
      id: z.string(),
      chat_id: z.string(),
      sender_id: z.string(),
      content: z.string(),
      created_at: z.string(),
    }), "Message created"),
    [httpStatus.UNAUTHORIZED]: jsonContent(createMessageObjectSchema("Unauthorized"), "Unauthorized"),
    // [httpStatus.INTERNAL_SERVER_ERROR]: jsonContent(z.object({
    //   message: z.string()
    // }), "Internal Server Error")
  }
}), async (c) => {
  const current_user_ret = await get_current_user_and_res(c);
  if (!current_user_ret.success) return c.json(current_user_ret.json_body, current_user_ret.status);
  const current_user = current_user_ret.user;

  const { target_id, content, target_type } = c.req.valid("json");

  // try {
    const message = await sendMessage(current_user.id, target_id, content, target_type);
    return c.json(message, httpStatus.CREATED);
  // } catch (error: any) {
  //   // return c.json({ message: error.message }, httpStatus.INTERNAL_SERVER_ERROR);
  // }
});

router.openapi(createRoute({
  tags: ["chats"],description: `Get list of messages`,
  method: "get", path: "/chats/{chat_id}/messages",
  request: {
    params: z.object({
      chat_id: z.string()
    })
  },
  responses: {
    [httpStatus.OK]: jsonContent(z.object({
      messages: z.array(z.object({
        id: z.string(),
        sender_id: z.string(),
        sender: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string().nullable().optional(),
          image: z.string(),
          nickname: z.string().nullable().optional(),
        }).nullable(),
        content: z.string(),
        created_at: z.string(),
      }))
    }), "List of messages"),
    [httpStatus.UNAUTHORIZED]: jsonContent(createMessageObjectSchema("Unauthorized"), "Unauthorized"),
    [httpStatus.NOT_FOUND]: jsonContent(createMessageObjectSchema("Chat not found"), "Chat not found"),
  }
}), async (c) => {
  const CU_ret = await get_current_user_and_res(c)
  if (!CU_ret.success) return c.json(CU_ret.json_body, 401)
  const auth_user = CU_ret.user

  const { chat_id } = c.req.valid("param");

  // 查询聊天是否存在
  const [chat] = await db.select().from(chat_table).where(eq(chat_table.id, chat_id))
  if (!chat) return c.json({ message: "Chat not found" }, httpStatus.NOT_FOUND);

  // 查询聊天的消息列表
  const messages = await db.select({
    id: message_table.id,
    sender_id: message_table.sender_id,
    sender: {
      id: user_table.id,
      name: user_table.name,
      email: user_table.email,
      image: user_table.image,
      nickname: user_table.nickname,
    },
    content: message_table.content,
    created_at: message_table.created_at,
  }).from(message_table)
    .leftJoin(user_table, eq(message_table.sender_id, user_table.id))
    .where(eq(message_table.chat_id, chat_id))
    // .orderBy(message_table.created_at.asc());

  return c.json({ messages }, httpStatus.OK);
});

export default router;