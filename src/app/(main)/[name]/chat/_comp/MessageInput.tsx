'use client'
import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  return (
    <div className="flex items-center p-4 ">
      <input
        type="text"
        className="flex-1 p-2 border rounded-lg"
        placeholder="输入消息..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
      />
      <button
        className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        onClick={handleSendMessage}
      >
        发送
      </button>
    </div>
  );
};
