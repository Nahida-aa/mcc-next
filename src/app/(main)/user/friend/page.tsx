import { HomeHeader } from '@/components/layout/header/home-header'
import React from 'react'
import { cookies } from 'next/headers';
import Link from 'next/link'; // 对 next 内的 router 的跳转
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area';
import { CommonHeader } from '@/components/layout/header/common-header';
import { server_auth } from '@/app/(auth)/auth';
import { ChevronRight } from 'lucide-react';

export default async function FriendPage() {
  const [session, cookieStore] = await Promise.all([server_auth(), cookies()]);


  return (
    <main className='h-full'>
      <CommonHeader user={session?.user} className='sticky top-0 z-10' />
      <section className='bg-background/60 h-full'>
        <div className='py-2'>
          <Button  className='bg-muted/60 hover:bg-muted text-foreground  flex justify-between focus-visible:ring-0 focus-visible:ring-offset-0 w-full rounded-none'
            >
            <span>New friends</span>
            <ChevronRight className='opacity-50' />
          </Button>
          <Button  className=' bg-muted/60 hover:bg-muted text-foreground  flex justify-between focus-visible:ring-0 focus-visible:ring-offset-0 w-full rounded-none'
            >
            <span>Team notification</span>
            <ChevronRight className='opacity-50' />
          </Button>
        </div>
      </section>
    </main>
  )
}
