'use client'
import React, { useEffect } from 'react';
import { ChatsWithCount, listChat_by_userId } from '@/lib/db/q/user/chat';
// import { UserMeta } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { UserMeta } from '@/components/layout/sidebar/user-side-toggle';
import { toast as sonner_toast } from "sonner"
import { ChatsWithCountApiResBody } from '@/lib/routes/chats';

export function ClientLoggedInIndexPage({ 
  session, className 
}: { 
  session: { user: UserMeta, token: string };
  className?: string; 
}) {
  const [chats, setChats] = React.useState<ChatsWithCount['chats']>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/hono/chats')
        const data: ChatsWithCountApiResBody = await res.json()
        if (res.ok) {
          const chatsData = data as ChatsWithCount
          setChats(chatsData.chats)
          localStorage.setItem('chats', JSON.stringify(chatsData.chats));
          console.log(data)
        } else {
          const msgData = data as { message: string }
          sonner_toast.warning(msgData.message)
        }
      } catch (error: any) {
        console.error(error)
        sonner_toast.error(error.message)
      }
    }

    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    } else {
      fetchChats();
    }
  }, []);
  try {
    // const chats = await chatList_by_userId(session.user.id);
    // if (!chats || chats.length === 0) return <div>没有聊天记录</div>;
    return (
      <main className='space-y-2'>
        <span>当前登录了哦</span>
        <pre>
          <code>
            {JSON.stringify(chats, null, 2)}
          </code>
        </pre>
        {/* <HomeHeader user={session?.user} /> */}
        <Button className='h-auto'>
          <a href="/api/hono" target="_blank">
            去 api 交互文档(Scalar UI)
          </a>
        </Button><br />
        <Button className='h-auto w-full'>
          <a href="/docs" target="_blank" className="w-full">
            去 api 交互文档(Swagger UI)<br />
            样式有问题, 我没完整的进行修复, 不建议使用, <br />
            因为我有提供 openapi.json 可以下载<br />
            或复制源代码
          </a>
        </Button><br />
        <Button>
          <a href="/api/hono/doc" target="_blank">
            去 openapi.json 
          </a>
        </Button><br />
        <Button>
          <a href="https://api.Nahida-aa.us.kg" target="_blank" >
            去 api 交互文档(FastApi)(已废弃)
          </a>
        </Button>
      </main>
    );
  } catch (error: any) {
    console.error('Error in LoggedInIndexPage:', error);
    return <div>发生错误: {error.message}</div>;
  }
}