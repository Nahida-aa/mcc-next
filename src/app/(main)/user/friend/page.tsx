import { HomeHeader } from '@/components/layout/header/home-header'
import React from 'react'
import { cookies } from 'next/headers';
import Link from 'next/link'; // 对 next 内的 router 的跳转
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area';
import { CommonHeader } from '@/components/layout/header/common-header';
import { server_auth } from '@/app/(auth)/auth';

export default async function FriendPage() {
  const [session, cookieStore] = await Promise.all([server_auth(), cookies()]);


  return (
    <main className=''>
      <CommonHeader user={session?.user} className='sticky top-0 z-10' />
      Friend list
    </main>
  )
}
