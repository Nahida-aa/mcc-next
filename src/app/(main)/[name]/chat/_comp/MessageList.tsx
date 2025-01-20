import { ShadcnAvatar } from '@/components/common/avatar';
import { UserMeta } from '@/lib/schema/user';
import React from 'react';
import NextImage from 'next/image'

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
  currentUser: UserMeta
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  return (
    <>
      {messages.map((message) => (
        <div key={message.id} className={`flex w-full ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
          
          <div className={`p-2 rounded-lg ${message.sender_id === currentUser.id ? 'bg-blue-500 text-white ' : 'bg-gray-200 text-black'}`}>
            <div className="text-sm">{message.content}</div>
            {/* <div className="text-xs opacity-50">{new Date(message.timestamp).toLocaleTimeString()}</div> */}
          </div>
          {message.sender_id === currentUser.id && (<div className='size-8 ml-2'>
            <NextImage src={currentUser.image} width={32} height={32} alt={currentUser.name} fill={false} className='rounded-full' />
          </div>)}
        </div>
      ))}
    </>
  );
};