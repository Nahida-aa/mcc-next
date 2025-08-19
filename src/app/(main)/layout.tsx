// "use client";

import { Main } from "./_comp/Main"
import { Test } from "../demo/Test"
import { ListIsExpandContextProvider } from "./@project/[type]/_comp/ListWithSearchContext"
import { LayoutExpandToggle } from "./_comp/LayoutExpandToggle"


export default async function Layout({
  children, 
  project, 
  chat
}: {
  children: React.ReactNode, 
  project: React.ReactNode, 
  chat: React.ReactNode
}) {

  return <>
    {/* <div className="relative h-screen w-full"> */}
      {/* 全局展开/收起按钮 - 最外层 */}
      <LayoutExpandToggle />
      {/* {children} */}
      <Main projectUI={project} chatUI={chat} />
    {/* </div> */}
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
