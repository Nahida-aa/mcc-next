import React from 'react';
import { listChat_by_userId } from '@/lib/db/q/user/chat';
// import { UserMeta } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { UserMeta } from '@/components/layout/sidebar/user-side-toggle';

export default async function LoggedInIndexPage({ 
  session, className 
}: { 
  session: { user: UserMeta, token: string };
  className?: string; 
}) {
  // if (!session) return <Loader />
  // // 携带 token 请求聊天列表
  // const res = await fetch('http://127.0.0.1:3000/api/hono/chats', {
  //   headers: {
  //     'Authorization': `Bearer ${session.token}`
  //   }
  // })
  // const ret = await res.json();
  // if (res.ok) {
  //   console.log(`chats: ${JSON.stringify(ret)}`)
  // }
  try {
    const chats = await listChat_by_userId(session.user.id);
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