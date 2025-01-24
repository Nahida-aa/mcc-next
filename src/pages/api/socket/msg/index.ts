import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/lib/types/index";
import { sendMessage } from "@/lib/db/q/user/msg";

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
    const { sessionUserId, target_id, content, target_type } = req.body;
    // const message = await sendMessage(sessionUser.id, target_id, content, target_type);
    console.log('sessionUserId', sessionUserId, 'target_id', target_id, 'content', content, 'target_type', target_type)
    const message = await sendMessage(sessionUserId, target_id, content, target_type);

    const wsChatRoomKey = `$chat:${message.chat_id}`

    // res.socket.server.io.to(wsChatRoomKey).emit('message', message); // 这个不知道为啥好像有问题 、 超时?
    res.socket.server.io.emit(`${wsChatRoomKey}:message`, message);
    
    return res.status(201).json(message);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}