'use client';
import { ChevronUp } from 'lucide-react';
import Image from 'next/image';
// import type { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { client_sign_out } from '@/app/(auth)/client';
import { UserMeta } from '@/components/layout/sidebar/user-side-toggle';

export function SidebarUserNav({ user }: { user?: UserMeta }) {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const isGuest = !user;
  const img_src = user?.image ?? `https://avatar.vercel.sh/${user?.email}`
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
              <Image
                src={img_src}
                alt={user?.name ?? 'User Avatar'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="truncate">{isGuest ? "未登录" : user?.name}</span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => {
                  if (isGuest) {
                    router.push('/sign-in'); // 导航到登录页面
                  } else {
                    // signOut({
                    client_sign_out({
                      redirectTo: '/',
                    });
                  }
                }}
              >
                {isGuest ? 'Sign in' : 'Sign out'}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
