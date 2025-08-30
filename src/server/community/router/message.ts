
import { createSubApp } from '@/api/create.app';
import { broadcastToChannel } from '@/api/ws/router';
import { jsonContent } from '@/server/openapi/helpers/json-content';
import { messageObjectSchema } from '@/server/openapi/schemas/res';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
// import { sendMsgSchema } from './community/model/message';


// 重新定义 sendMsgSchema 使用 @hono/zod-openapi 的 z
const sendMsgSchema = z.object({
  channelId: z.uuid(),
  userId: z.string(),
  content: z.string().nullable().optional(),
  contentType: z.string().optional().default("text"),
  replyToId: z.uuid().optional().nullable(),
  attachments: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    type: z.string(),
    size: z.number(),
  })).optional().default([])
}).openapi({
  example: {
    channelId: "550e8400-e29b-41d4-a716-446655440000",
    userId: "user123",
    content: "Hello world!",
    contentType: "text"
  }
});

const sendMessageRoute = createRoute({
  tags: ["message"], 
  method: "post", 
  path: "", 
  description: "发送消息到频道",
  request: {
    body: jsonContent(sendMsgSchema, "发送消息"),
  },
  responses: {
    200: jsonContent(sendMsgSchema, "发送消息成功"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    422: jsonContent(messageObjectSchema("请求参数错误"), "参数错误"),
    500: jsonContent(messageObjectSchema("发送消息失败"), "服务器错误")
  }
});

const app = createSubApp()
// HTTP 消息发送路由
.openapi(sendMessageRoute, async (c) => {
  try {
    // 获取验证过的 JSON 数据
    const message = c.req.valid("json");
    
    // 验证必要字段
    if (!message.channelId || !message.userId) {
      return c.json({ 
        message: 'Missing required fields: channelId, userId' 
      }, 422);
    }
    
    console.log('http:post:/message::Received message:', message);
    
    // 1. 保存消息到数据库
    // const savedMessage = await saveMessageToDB(message);
    const savedMessage = { ...message, id: 'generated-id-123' };
    
    // 2. 通过 WebSocket 实时推送给频道内的用户
    broadcastToChannel(message.channelId, {op: 'newMessage', d: savedMessage});
    
    return c.json(message, 200);
  } catch (error) {
    console.error('Error processing message:', error);
    return c.json({ 
      message: 'Invalid JSON or server error'
    }, 500);
  }
})

export default app;