import { ChatNav } from "./_comp/nav";

export default async function Layout({
  children
}: {
  children: React.ReactNode, 
}) {
  return <ChatNav>
    {children}
  </ChatNav>
}
