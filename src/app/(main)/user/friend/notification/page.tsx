import { Suspense } from 'react';
import { Loader } from '~/components/ui/loading/Loading';
import { SubHeader } from '~/components/layout/header/sub-header';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '~/components/ui/sidebar';
import { Bell, FileUser, PersonStanding, Plus } from 'lucide-react';
import { server_auth } from '~/app/(auth)/auth';
import { FriendNotificationList } from './_comp/notification';

const FriendNotification = async () => {
  const session = await server_auth()
  if (!session) return <Loader />
  return <>
    <SubHeader 
      className='sticky top-0 z-10' > 
      New friends 
    </SubHeader>
    <Suspense fallback={<Loader />}>
      <SidebarGroup className='p-0 bg-card/80'>
        <SidebarGroupLabel className='text-sidebar-foreground px-3'>Friend notification</SidebarGroupLabel>
        <FriendNotificationList sessionUserId={session?.user.id} />
      </SidebarGroup>
    </Suspense>
  </>
}

export default FriendNotification