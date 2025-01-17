import { HomeHeader } from '@/components/layout/header/home-header'
import React from 'react'
import { cookies } from 'next/headers';
import Link from 'next/link'; // 对 next 内的 router 的跳转
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area';
import { server_auth } from '@/app/(auth)/auth';
import { SubHeader } from '@/components/layout/header/sub-header';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input"
import SearchButton from '../user/friend/add/_comp/search-button';

export default async function SettingPage() {
  const [session, cookieStore] = await Promise.all([server_auth(), cookies()]);
  

  return (<>
    <SubHeader 
      user={undefined}
      className='sticky top-0 z-10' > 
      Settings
    </SubHeader>
    <main className='bg-card/80 h-full'>
      <SearchButton router_push='/setting/search' />
    </main>
  </>)
}
