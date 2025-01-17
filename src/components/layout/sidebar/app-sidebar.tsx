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
  useSidebar,
} from '@/components/ui/sidebar';
import { BetterTooltip } from '@/components/common/BetterTooltip';
import Link from 'next/link';
import { UserMeta } from './user-side-toggle';
import { X } from 'lucide-react';


export function AppSidebar({ user }: { user: UserMeta | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const displayUser = user || { email: 'guest@example.com', name: 'Guest' }
  let user_status
  if (user) {
    user_status = "online"
  } else {
    user_status = "未登录"
  }
  return (
    <Sidebar className="group-data-[side=left]:border-r-0 backdrop-blur-md ">
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
                  setOpenMobile(false);
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-0">
        {/* {displayUser && ( */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarUserNav user={user} status={user_status} />
            </SidebarGroupContent>
          </SidebarGroup>
        {/* )} */}
      </SidebarFooter>
    </Sidebar>
  );
}
