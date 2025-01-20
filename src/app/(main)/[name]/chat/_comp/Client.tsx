'use client'
import { SubHeader } from '@/components/layout/header/sub-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom'
import { AlignJustify } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { MessageInput } from './MessageInput'
import { UserMeta } from '@/components/layout/sidebar/user-side-toggle'
import { useRouter } from 'next/navigation'
import { Message, MessageList } from './MessageList'
import { toast as sonner_toast } from "sonner"
import { SocketIndicator } from '@/components/common/socket-indicator'

export const ClientMain = ({
  decodeURLComponentName,
  sessionUser,
}: {
  decodeURLComponentName: string,
  sessionUser?: UserMeta
}) => {
  const router = useRouter()
  if (!sessionUser) {router.push('/sign-in')
    return
  }

  // 内容发送变化时自动滚动到底部
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>()
  // const chatView = messagesContainerRef.current
  // if (chatView) {
  //   chatView.scrollTop = chatView.scrollHeight - chatView.clientHeight;
  // }

  const [messages, setMessages] = useState<Message[]>([]);
  const [target, setTarget] = useState<UserMeta | null>(null);
  
  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      sender_id: sessionUser.id,
      content: content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send message to WebSocket server
    // const ws = new WebSocket("ws://your-websocket-url");
    // ws.onopen = () => {
    //   ws.send(JSON.stringify(newMessage));
    // };
  };

  return <>
    <SubHeader justify="between"> 
      <div className="flex gap-2">
        <Badge variant="secondary" className="px-1">13</Badge>
        <div>
          {decodeURLComponentName}
        </div>
      </div>
      <SocketIndicator />
      <div className="flex items-center">
        <Button variant='ghost' size="icon" className='p-0 gap-0 size-8 mr-1'>
          <AlignJustify size={32} className='min-w-8 min-h-8 opacity-50' />
        </Button>
      </div>
    </SubHeader>
    {/* overflow-y-auto */}
      <div 
      className="bg-background/60 h-screen absolute w-full top-0  px-4 flex flex-col flex-1  gap-6 overflow-y-scroll " 
      ref={messagesContainerRef}
      >
        <div className='h-10 py-1.5 min-h-10'></div>
        <div className=" bg-red-500">
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
          你好<br />   不好<br /></div>
        <MessageList messages={messages} currentUser={sessionUser} />
        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-20"
        />
      </div>
    
    <footer className="w-full absolute bottom-0 h-20 bg-card/80 backdrop-blur-md z-10">
      <MessageInput onSendMessage={handleSendMessage} />
    </footer>
  </>
}
