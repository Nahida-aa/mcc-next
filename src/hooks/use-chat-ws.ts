import { useEffect } from "react";
import { useSocket } from "@/components/providers/socket-provider";
import { ClientMessageI } from "@/app/(main)/[name]/chat/_comp/MessageList";
import { useMsgQuery } from "./use-chat-query";

type MsgSocketProps = {
  chatId: string;
}

export const useMsgSocket = ({
  chatId,
}: MsgSocketProps) => {
  const wsChatRoomKey = `chat:${chatId}`;
  const msgsApiUrl = `/api/hono/chats/${chatId}/msgs/cursor`
  const { socket } = useSocket();
  const { data, error, isLoading: msgsIsLoading, size, setSize, mutate: mutateMsgLists } = useMsgQuery(msgsApiUrl)
  
  useEffect(() => {
    if (socket && chatId) {
      socket.emit('joinChatRoom', chatId);
      console.log('client send joinChatRoom', chatId)
      const handleMessage = (newMessage: ClientMessageI) => {
        mutateMsgLists((oldMsgLists) => {
          if (!oldMsgLists) return [{items: [newMessage]}]
          return [{items: [newMessage]}, ...oldMsgLists]
        }, false);
      };
      socket.on('message', handleMessage); // 由于 socket room 机制 可能因为环境等问题 受到影响
      socket.on(`${wsChatRoomKey}:message`, handleMessage);
      return () => {
        socket.emit('leaveChatRoom', chatId);
        socket.off('message', handleMessage);
      };
    }
  }, [socket, chatId]);
}