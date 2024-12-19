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
    <main >
      {/* <HomeHeader user={session?.user} /> */}
      <a href="https://api.Nahida-aa.us.kg" target="_blank">
        <Button >
          去 api 交互文档(FastApi)
        </Button>
      </a>
    </main>
  )
}
