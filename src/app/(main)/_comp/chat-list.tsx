import type { Chat } from '@/lib/db/q/user/chat';

const ChatList = ({ 
  chats 
} : { chats: Chat[] }
) => {
  return (
    <div>
      {chats.map(chat => (
        <div key={chat.id} className="chat-item">
          <div className="chat-info">
            {chat.target_type === 'user' ? (
              <>
                <img src={chat.target_user?.image} alt={chat.target_user?.name} />
                <div>{chat.target_user?.name}</div>
              </>
            ) : (
              <>
                <img src={chat.target_group?.image} alt={chat.target_group?.name} />
                <div>{chat.target_group?.name}</div>
              </>
            )}
          </div>
          <div className="chat-message">
            <div>{chat.latest_message}</div>
            <div>{new Date(chat.latest_message_timestamp).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;