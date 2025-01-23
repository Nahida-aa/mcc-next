'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CirclePlus, Smile } from 'lucide-react';
import React, { useState } from 'react';

{/* <div className=" bg-red-500">
你好<br />    最早<br />    最早<br />    最早<br />
  最早<br />    最早<br /> 最早<br />最早<br />
  最早<br />
  88778<br />    你好<br />
  你好<br />    你好<br />
  你好<br />   不好<br />
</div>
<div className=" bg-blue-500">
你好<br />    你好<br />    你好<br />    你好<br />
  你好<br />    你好<br /> 你好<br />你好<br />
  你好<br />
  88778<br />    你好<br />
  你好<br />    你好<br />
  你好<br />   不好<br />
</div>
<div className=" bg-green-500">          你好<br />    你好<br />    你好<br />    你好<br />
  你好<br />    你好<br /> 你好<br />你好<br />
  你好<br />
  88778<br />    你好<br />
  你好<br />    你好<br />
  你好<br />   不好<br /></div>
<div className=" bg-blue-500">          你好<br />    你好<br />    你好<br />    你好<br />
  你好<br />    你好<br /> 你好<br />你好<br />
  你好<br />
  88778<br />    你好<br />
  你好<br />    你好<br />
  你好<br />   不好<br /></div>
<div className=" bg-red-500">          你好<br />    你好<br />    你好<br />    你好<br />
  你好<br />    你好<br /> 你好<br />你好<br />
  你好<br />
  88778<br />    你好<br />
  你好<br />    你好<br />
  你好<br />   不好<br /></div>
<div className=" bg-green-500">          你好<br />    最新<br />    最后<br />    最后<br />
  最后<br />    最后<br /> 最后<br />最后<br />
  h<br />
  88778<br />    资源<br />
  最后<br />    最新<br />
  你好<br />   不好<br /></div> */}

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [content, setContent] = useState('');

  const handleSendMessage = () => {
    if (content.trim()) {
      onSendMessage(content);
      setContent('');
    }
  };
  return (
    <div className="flex items-center gap-2 ">
      <Input
        type="text"
        className=" bg-muted focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
        placeholder="Enter message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
      />
      {content==='' ? <><Smile className='opacity-80' /> <CirclePlus className='opacity-80' /></> : <Button
        className="h-[1.875rem] p-2"
        disabled={content===''}
        onClick={handleSendMessage}
      >
        send
      </Button>}
      
    </div>
  );
};
