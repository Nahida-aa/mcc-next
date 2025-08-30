import { Server } from "socket.io";
import { NextRequest } from "next/server";
import { onUserEnterChannel, sendMsg } from "@/server/community/service/message";
import { SendMsgInput } from "@/server/community/model/message";

let io: Server | null = null;

export async function GET(req: NextRequest) {
  if (!io) { // The API route initializes a Socket.IO server if it doesn’t already exist. {API 路由会初始化 Socket.IO 服务器（如果尚不存在）}
    // Initialize Socket.IO server
    const httpServer = (req as any).nextServer; // Access underlying HTTP server
    io = new Server(httpServer, {
      path: "/api/socket/io", // 让客户端可以使用这个路径连接到 Socket.IO 服务器
      cors: {
        origin: "*", // Adjust for production
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // Handle user joining a channel
      socket.on("joinChannel", async ({ userId, channelId }) => {
        socket.join(channelId); // Join Socket.IO room for the channel
        // Update read state
        await onUserEnterChannel(userId, channelId);
        io?.to(channelId).emit("userJoined", { userId, channelId });
      });

      // Handle sending messages
      socket.on("sendMessage", async (data: SendMsgInput) => {
        const message = await sendMsg(data); // Insert to DB
        io?.to(data.channelId).emit("newMessage", message); // Broadcast to channel
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  return new Response("Socket.IO server running", { status: 200 });
}