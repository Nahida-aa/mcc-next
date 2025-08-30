import { serve } from '@hono/node-server';
import app from './app';
import { injectWebSocket } from './ws/router';

const port = 3001;

console.log(`Starting server on port ${port}...`);

// 启动服务器
const server = serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Hono server is running: http://${info.address}:${info.port}`);
  console.log(`WebSocket available at: ws://${info.address}:${info.port}/ws`);
});

// 注入 WebSocket 支持
injectWebSocket(server);
