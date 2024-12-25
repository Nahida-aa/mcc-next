import { HomeHeader } from '@/components/layout/header/home-header'
import React from 'react'
import { server_auth } from '../(auth)/auth';
import { cookies } from 'next/headers';
import Link from 'next/link'; // 对 next 内的 router 的跳转
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation'

export default async function AA() {
  const [session, cookieStore] = await Promise.all([server_auth(), cookies()]);
  const toApiDoc = async () => {
    redirect('https://api.Nahida-aa.us.kg')
  }
  return (
    <main className='space-y-2'>
      {/* <HomeHeader user={session?.user} /> */}
      <Button className='h-auto'>
        <a href="/api/hono" target="_blank">
          去 api 交互文档(Scalar UI)
        </a>
      </Button><br />
      <Button className='h-auto'>
        <a href="/docs" target="_blank">
          去 api 交互文档(Swagger UI)<br />
          样式有问题, 我没完整的进行修复, 不建议使用, <br />
          因为我有提供 openapi.json 可以下载或复制源代码
        </a>
      </Button><br />
      <Button >
      <a href="/api/hono/doc" target="_blank">
          去 openapi.json 
      </a>
      </Button><br />
      <Button>
        <a href="https://api.Nahida-aa.us.kg" target="_blank" >
          去 api 交互文档(FastApi)(已废弃)
        </a>
      </Button><br />
    </main>
  )
}
