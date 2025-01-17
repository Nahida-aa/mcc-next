import { HomeHeader } from '@/components/layout/header/home-header'
import React from 'react'
import { server_auth } from '../(auth)/auth';
import { cookies } from 'next/headers';
import Link from 'next/link'; // 对 next 内的 router 的跳转
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area';
import NotLoginIndexPage from './not_login';
import LoggedInIndexPage from './logged_in';

export default async function AA() {
  const [session, cookieStore] = await Promise.all([server_auth(), cookies()]);
  if (!session){
    return (
      <main className=''>
        <HomeHeader user={undefined} className='sticky top-0 z-10' />
        <div className='overflow-auto h-full flex w-full'>
          <NotLoginIndexPage />
        </div>
      </main>
    )
  }

  return (
    <main className=''>
      <HomeHeader user={session?.user} className='sticky top-0 z-10' />
      <div className='overflow-auto h-full flex w-full'>
        <LoggedInIndexPage user={session?.user} />
      </div>
    </main>
  )
}
