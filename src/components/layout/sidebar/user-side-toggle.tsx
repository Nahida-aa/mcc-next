import type { ComponentProps } from 'react';
import Image from 'next/image';
import { type SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { BetterTooltip } from '@/components/common/BetterTooltip';

import { SidebarLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';

export type UserMeta = {
  id?: string;
  email: string;
  name: string;
  nickname?: string;
  image?: string;
}
interface UserSidebarToggleProps {
  user?: UserMeta 
  className?: string;
  status?: string;
}
export function UserSidebarToggle({
  user,
  className,
  status = "offline", // 默认状态为 offline
}:  UserSidebarToggleProps
// ComponentProps<typeof SidebarTrigger>
) {
  const { toggleSidebar } = useSidebar();
  const img_src = user?.image ?? `https://avatar.vercel.sh/${user?.email}`

  const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    // return `https://example.com/${src}?w=${width}&q=${quality || 75}`
    return src
  } // next 15
  return (
    <BetterTooltip content="Toggle Sidebar" align="start">
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        className="p-1 md:h-fit relative size-10 rounded-full hover:bg-opacity "
      >
        <Image
          // loader={imageLoader}
          src={img_src}
          alt={user?.email ?? 'User Avatar'}
          width={32}
          height={32}
          className="rounded-full hover:glow-purple-box-shadow"
        />
          <span className={`absolute bottom-1 right-1 w-2 h-2  border-1 rounded-full 
            ${status === "online" ? 'bg-green-500' : 'bg-gray-500'}
            `}></span>
        {/* {status === "online" && (
        )} */}
      </Button>
    </BetterTooltip>
  );
}
