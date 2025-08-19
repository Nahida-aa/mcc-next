import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/lib/types/index";
import { sendMessage } from "@/db/q/user/msg";
import { ApiSendMessageBody } from "@/app/(main)/chat/[name]/_comp/Client";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    // const session = await server_auth()
    // if (!session) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    // const sessionUser = session.user
    const { message, targetId,  targetType } = req.body as ApiSendMessageBody
    // const message = await sendMessage(sessionUser.id, targetId, content, targetType);
    console.log('message', message, 'targetId', targetId, 'targetType', targetType)
    const messageForDB = await sendMessage(message, targetId, targetType, false);

    // const wsChatRoomKey = `$chat:${message.chatId}`
    // res.socket.server.io.to(wsChatRoomKey).emit('message', message); // 这个不知道为啥好像有问题 、 超时?
    res.socket.server.io.emit(`$chat:${messageForDB.chatId}:message`, message);
    
    return res.status(201).json(messageForDB);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}