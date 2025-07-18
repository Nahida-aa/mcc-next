// "use client";

import { Main } from "./_comp/Main"
import { Test } from "../test/Test"


export default async function Layout({
  children, project, chat
}: {
  children: React.ReactNode, 
  project: React.ReactNode, 
  chat: React.ReactNode
}) {

  return <>
    {/* {children} */}
    <Main projectUI={project} chatUI={chat} />
  </>
    // <SidebarProvider defaultOpen={!isCollapsed} className='h-screen SidebarProvider  '> 
    // {/* 模糊背景 */}
    //   <AppSidebar user={session?.user} />
    //   <SidebarInset className='h-screen bg-opacity'>
    //     {/* <HomeHeader user={session?.user} /> */}
    //     {/* <HomeHeader user={session?.user} className='sticky top-0 z-10' /> */}
    //     {/* 下划线、间隔线 */}
    //     {/* <Separator className='mx-2'></Separator> */}
    //     {/* <div className='overflow-auto h-full flex w-full'> */}
    //       {/* <ScrollArea> */}
    //       {/* <aside className="flex z-30 w-14 h-full flex-col fixed inset-y-14"> */}
    //       {/* <aside className="flex  w-14 h-full flex-col">
    //         <NavigationSidebar></NavigationSidebar>
    //       </aside> */}
    //       {/* <main className='flex-1 w-full'> */}
            
    //       {/* </main> */}
    //       {/* </ScrollArea> */}
    //     {/* </div> */}
    //   </SidebarInset>
    // </SidebarProvider>
}
