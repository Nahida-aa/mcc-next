// import { HomeHeader } from '@/components/layout/header/home-header'
import React, { Suspense } from 'react'
import { z } from 'zod';
import Main from './[type]/_comp/main';
import { LoadingS } from '@/components/common/Loading';
// import { server_auth } from '../../(auth)/auth';
// import { cookies } from 'next/headers';
// import Link from 'next/link'; // 对 next 内的 router 的跳转
// import { Button } from '@/components/ui/button';
// import { redirect } from 'next/navigation'
// import { ScrollArea } from '@/components/ui/scroll-area';
// import NotLoginIndexPage from '../chat/_comp/not_login';
// import LoggedInIndexPage from '../chat/_comp/logged_in';
// import { ChatsClientMain } from '../chat/_comp/ChatsClientMain';
// import { SWRProvider } from '@/components/providers/swr-provider';
// import { ChatsWithCount, listChat_by_userId } from '@/lib/db/q/user/chat';
// import {ScrollShadow} from "@heroui/scroll-shadow";

export const querySchema = z.object({
  limit: z.string().default('40').transform((val) => parseInt(val, 10)),
  page: z.string().default('1').transform((val) => parseInt(val, 10)),
  sort: z.string().default('relevance'),
  keyword: z.string().optional(),
  versions: z.union([z.string(), z.undefined()])
    .transform((val) => (val ? [val] : undefined)),
  tags: z.union([z.string(), z.undefined()])
  .transform((val) => (val ? [val] : undefined)),
  loaders: z.union([z.string(), z.undefined()])
  .transform((val) => (val ? [val] : undefined)),
  environment: z.string().optional(),
  is_open: z.string().optional().transform((val) => (val === undefined ? undefined : val === 'true')),
});

export default async function Page( {
  searchParams
}:{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { role, ...itemSearchParams } = await searchParams
  console.log("Page:searchParams:", role)
  const parsedQuery = querySchema.parse(itemSearchParams);
  console.log("parsedQuery: ", parsedQuery)
  const type = 'mod'
  // const session = await server_auth();
  return <Suspense fallback={<LoadingS />}>
    <Main type={type} game_versions={parsedQuery.versions} is_open_source={parsedQuery.is_open} {...parsedQuery} />
  </Suspense>

  // return <>
  //   <main className=''>
  //     {/* <HomeHeader /> */}
  //     <div className='overflow-auto h-full w-full'>
  //       <div className='min-h-12' />
  //       {/* <NotLoginIndexPage /> */}
  //     </div>
  //   </main>
  // </>
  // if (!session){
  //   return (
  //     <main className=''>
  //       {/* <HomeHeader /> */}
  //       <div className='overflow-auto h-full w-full'>
  //         <div className='min-h-12' />
  //         <NotLoginIndexPage />
  //       </div>
  //     </main>
  //   )
  // }
  // const chats: ChatsWithCount = await listChat_by_userId(session.user.id);
  // const fallback = {
  //   '/api/hono/chats': chats
  // }
  // return (
  // <SWRProvider value={{ fallback }}>
  //   <ScrollShadow hideScrollBar  className="h-screen absolute top-0 w-full">
  //     <div className='min-h-12' />
  //       {/* <LoggedInIndexPage session={session} chats={chats} /> */}
  //     <ChatsClientMain session={session} />
  //     {/* <Content /> */}
  //   </ScrollShadow>
  // </SWRProvider>

}
