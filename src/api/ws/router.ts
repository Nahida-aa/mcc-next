import { createSubApp } from "@/api/create.app";
import { createNodeWebSocket } from "@hono/node-ws";
import { createMiddleware } from "hono/factory";
import { WSContext } from "hono/ws";
// 客户端发送的数据类型
export type ClientWsData = {
  op: "joinChannel"
  d: {
    channelId: string;
    userId: string;
  }
}
// 服务器发送的数据类型
export type ServerWsData = {
  op: "newMessage";
  d: {
    id: string;
    channelId: string;
    userId: string;
    content?: string|null;
    contentType: string;
    replyToId?: string| null;
    attachments?: {
      id: string;
      name: string;
      url: string;
      type: string;
      size: number;
    }[] | null;
  }
} | {
  op: "userJoined"
  d: {
    channelId: string;
    userId: string;
  }
}
const wsMiddleware = createMiddleware(async (c, next) => {
  console.log('WebSocket middleware triggered');
  await next();
})

const app = createSubApp()
// 存储 WebSocket 连接
const channelConnections = new Map<string, Set<WSContext<WebSocket>>>();
// 广播消息到频道的函数
export function broadcastToChannel(channelId: string, evtData: ServerWsData) {
  const connections = channelConnections.get(channelId);
  if (connections) {
    connections.forEach(ws => {
      try {
        ws.send(JSON.stringify(evtData));
      } catch (error) {
        console.error('Error sending message to WebSocket:', error);
      }
    });
  }
}
// 创建 WebSocket 支持
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })

// WebSocket 路由
const wsApp = app.get('/ws', wsMiddleware, upgradeWebSocket((c) => ({
  onOpen: (evt, ws) => {
    console.log('WebSocket connected');
  },
  
  onMessage: (evt, ws) => {
    try {
      // console.log('evt._type:', evt.type);
      const data = JSON.parse(evt.data.toString()) as ClientWsData
      if (data.op === 'joinChannel') {
        const { channelId, userId } = data.d;
        
        // 添加连接到频道
        if (!channelConnections.has(channelId)) {
          channelConnections.set(channelId, new Set());
        }
        channelConnections.get(channelId)?.add(ws);
        
        // 存储连接的频道信息
        (ws as any).channelId = channelId;
        (ws as any).userId = userId;
        
        console.log(`User ${userId} joined channel ${channelId}`);
        
        // 通知其他用户有人加入
        broadcastToChannel(channelId, {
          op: 'userJoined',
          d: { userId, channelId }
        });
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  },
  
  onClose: (evt, ws) => {
    const channelId = (ws as any).channelId;
    const userId = (ws as any).userId;
    
    if (channelId) {
      const connections = channelConnections.get(channelId);
      if (connections) {
        connections.delete(ws);
        if (connections.size === 0) {
          channelConnections.delete(channelId);
        }
      }
      console.log(`User ${userId} left channel ${channelId}`);
    }
  }
})))

export {injectWebSocket, wsApp}
