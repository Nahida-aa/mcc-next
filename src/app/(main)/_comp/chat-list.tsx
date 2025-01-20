import type { Chats } from '@/lib/db/q/user/chat';

const ChatList = ({ 
  chats 
} : { chats: Chats }
) => {
  return (
    <div>
      {chats.map(item => (
        <div key={item.chat.id} className="chat-item">
          <div className="chat-info">
            {item.chat.target_type === 'user' ? (
              <>
                <img src={item.target_user?.image} alt={item.target_user?.name} />
                <div>{item.target_user?.name}</div>
              </>
            ) : (
              <>
                <img src={item.target_group?.image} alt={item.target_group?.name} />
                <div>{item.target_group?.name}</div>
              </>
            )}
          </div>
          <div className="chat-message">
            <div>{item.chat.latest_message}</div>
            <div>{new Date(item.chat.latest_message_timestamp).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;