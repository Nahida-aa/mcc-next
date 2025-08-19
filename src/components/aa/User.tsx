import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import NextImage from 'next/image';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { CalendarIcon, Copy } from "lucide-react"
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { useSignOut } from "../providers/modal-provider";

export const User = ({
  image, status, displayName, email, onClick, className=''
}: {
  image?: string|null
  status: 'online' | 'offline';
  displayName?: string | null;
  email?: string;
  onClick?: () => void;
  className?: string;
}) => {
  const showSignOut = useSignOut()
  return <section className={`flex items-center gap-2 ${className}`}>
  <HoverCard>
  <DropdownMenu>

  
    <DropdownMenuTrigger asChild>
    <HoverCardTrigger asChild>
      <Button
        onClick={onClick}
        variant="ghost"
        className="p-1 md:h-fit relative h-10 rounded-full hover:bg-opacity "
        >
        <NextImage
          // loader={imageLoader}
          src={image || `https://avatar.vercel.sh/${email}` || `https://avatar.vercel.sh/Guest`}
          alt={displayName ?? 'User Avatar'}
          width={32}
          height={32}
          className="rounded-full hover:glow-purple-box-shadow"
        />
        <span className={`absolute bottom-1 right-1 w-2 h-2  border rounded-full 
          ${status === "online" ? 'bg-green-500' : 'bg-gray-500'}
          `}></span>
      </Button>
    </HoverCardTrigger>
    </DropdownMenuTrigger>
    <div className="h-9 flex flex-col justify-end items-start gap-0.5">
      <p className="h-4">{displayName}</p>
      <p className="h-4 text-xs text-muted-foreground flex items-end">
        {status === "online" && (
          <span className=" text-[10px] text-end">在线</span>
        )}
      </p>
    </div>
    <DropdownMenuContent className="w-56" align="start">
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem  onClick={() => showSignOut()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    <HoverCardContent className="w-60">
      <div className="flex flex-col">
          <Avatar className='size-20'>
            <AvatarImage src={image || `https://avatar.vercel.sh/${email}` || `https://avatar.vercel.sh/Guest`} className='size-20'/>
            <AvatarFallback>
              <Skeleton className="size-20 rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <span>
              <span className="text-lg font-semibold">{displayName}</span>
              {/* 复制按钮 */}
              <Button variant='ghost' size="icon" className="p-0 m-0 size-5 ml-2">
                <Copy size={8} />
              </Button>
            </span>
            <p className="text-sm">
              {email}
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
    </HoverCardContent>
  </DropdownMenu>
  </HoverCard>
  </section>
}