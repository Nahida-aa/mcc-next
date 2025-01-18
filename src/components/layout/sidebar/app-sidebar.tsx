'use client';

// import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@/components/icons';
// import { SidebarHistory } from '@/components/sidebar-history';
// import { SidebarUserNav } from '@/components/layout/sidebar/sidebar-user-nav';
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
import { ChevronDown, ChevronRight, LogIn, PencilLine, QrCode, Settings, Star, X } from 'lucide-react';
import { UserSidebarFooter } from './footer';
import { ModeToggle } from '@/components/common/ModeToggle';
import { ShadcnAvatar } from '@/components/common/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


export function AppSidebar({ user }: { user: UserMeta | undefined }) {
  const router = useRouter();
  const { setOpen, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  const displayUser = user || { email: 'guest@example.com', name: 'Guest' }
  let user_status
  if (user) {
    user_status = "online"
  } else {
    user_status = "not logged in"
  }
  const img_src = user?.image ?? `https://avatar.vercel.sh/Guest`

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 backdrop-blur-md Sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className='pr-0'>
                Select Workspace
                <ChevronDown className="ml-auto" />
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
              </SidebarMenuButton>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              <DropdownMenuItem>
                <span>
                  Navigate list
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Chat list</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> 
        </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <section className=''>
          <div className='flex gap-2 mx-2' >
            <ShadcnAvatar src={img_src} size={14} className='size-14' onclick={()=>{
              if (user) router.push(`/${user.name}`);
            }} />
            {user ? (<>
              <SidebarMenu className='mr-2 gap-0 h-[min-count]'>
                <SidebarMenuItem className='h-5'>
                  <SidebarMenuButton className='h-5' onClick={() => router.push(`/${user.name}`)}
                  >
                    <span>{user.nickname ? user.nickname : user.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className='h-5'>
                  <SidebarMenuButton className='h-5 justify-between'>
                    <span>todo</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className='h-5'>
                  <SidebarMenuButton className='h-5'>
                    <span className='flex items-center gap-1 opacity-50'><PencilLine className='size-3 opacity-50' />describes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <div className='w-auto h-[3.75rem] justify-between flex flex-col items-end'>
                <DropdownMenu>
                  <DropdownMenuTrigger className='text-xs h-4 top-0'>
                    <span className='flex items-center gap-1 opacity-75'>switchAccount<ChevronDown className='size-3 opacity-75 ' /></span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <Button variant='ghost' size='icon' className=' p-0 m-0 gap-0'> */}
                  <QrCode className='size-6 opacity-50' onClick={
                    (e) => {
                      e.preventDefault();
                      console.log('qr-code');
                      // router.push('/qr-code');
                    }
                  } />
                {/* </Button> */}
              </div>
              </>) : (
              <SidebarMenu className='mr-2 gap-0 bg-sidebar-accent/75 rounded-md'>
                <SidebarMenuItem>
                  <SidebarMenuButton className='rounded-b-none justify-between'
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/sign-in');
                    }}
                  >
                    <span className='flex items-center gap-2'><LogIn className='opacity-50 size-4' /><span className=''>Sign In</span></span><ChevronRight className='opacity-50' />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className='rounded-t-none justify-between'>
                    <span className='flex items-center gap-2'><QrCode className='opacity-50 size-4' /><span className=''>QR Code SignIn
                      </span></span><ChevronRight className='opacity-50' />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </div>
        </section>
        <section>
        <SidebarMenu className='mx-2 w-auto gap-0 bg-muted rounded-md'>
          <SidebarMenuItem>
            <SidebarMenuButton className='rounded-t-none justify-between opacity-75'>
              <span className='flex items-center gap-2'>
                <Star className=' size-4' /> My stars 
              </span>
              <ChevronRight className='' />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        </section>
      </SidebarContent>
      {/* <UserSidebarFooter user={user} status={user_status} /> */}
      <SidebarFooter>
        <SidebarMenu className='flex-row'>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={() => {
                router.push('/setting');
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
