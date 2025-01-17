'use client';

// import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@/components/icons';
// import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/layout/sidebar/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { BetterTooltip } from '@/components/common/BetterTooltip';
import Link from 'next/link';
import { UserMeta } from './user-side-toggle';
import { Settings, X } from 'lucide-react';
import { UserSidebarFooter } from './footer';
import { ModeToggle } from '@/components/common/ModeToggle';


export function AppSidebar({ user }: { user: UserMeta | undefined }) {
  const router = useRouter();
  const { setOpen, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  const displayUser = user || { email: 'guest@example.com', name: 'Guest' }
  let user_status
  if (user) {
    user_status = "online"
  } else {
    user_status = "未登录"
  }
  return (
    <Sidebar className="group-data-[side=left]:border-r-0 backdrop-blur-md Sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                mcc
              </span>
            </Link>
            <BetterTooltip content="关闭 side" align="start">
              <Button
                variant="ghost"
                type="button"
                className="p-2 h-fit"
                onClick={() => {
                  toggleSidebar()
                  // setOpen(false);
                  // setOpenMobile(false);
                  // router.push('/');
                  // router.refresh();
                }}
              >
                <X />
              </Button>
            </BetterTooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarHistory user={user} /> */}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton >
                  <span className='h-40 bg-red-600'></span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <UserSidebarFooter user={user} status={user_status} /> */}
      <SidebarFooter>
        <SidebarMenu className='flex-row'>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={() => {
                // router.push('/setting');
              }}
            >
              <Button variant='ghost' size='icon' className='size-10'>
              <Settings />
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <ModeToggle variant={'ghost'} className='size-10 active:bg-sidebar-accent' />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
