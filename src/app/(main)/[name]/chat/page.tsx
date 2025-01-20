import { SubHeader } from "@/components/layout/header/sub-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlignJustify } from "lucide-react"
import { useState } from "react"
import { Message } from "./_comp/MessageList"
import { MessageInput } from "./_comp/MessageInput"
import { ClientMain } from "./_comp/Client"
import { server_auth } from "@/app/(auth)/auth"
import { Loader } from "@/components/ui/loader/Loader"
import { redirect } from 'next/navigation'

// export default async function AddFriendByNamePage({
export default async function AddFriendByNamePage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const name = (await params).name
  const decodeURLComponentName = decodeURIComponent(name)
  const session = await server_auth()
  if (!session) return redirect('/sign-in')


  // const [messages, setMessages] = useState<Message[]>([]);
  // const currentUser = "currentUser"; // Replace with actual current user ID

  // useEffect(() => {
  //   const ws = new WebSocket("ws://your-websocket-url");

  //   ws.onmessage = (event) => {
  //     const newMessage = JSON.parse(event.data);
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, []);

  // const handleSendMessage = (message: string) => {
  //   const newMessage = {
  //     id: Date.now().toString(),
  //     sender: currentUser,
  //     content: message,
  //     timestamp: new Date().toISOString(),
  //   };
  //   setMessages((prevMessages) => [...prevMessages, newMessage]);

  //   // Send message to WebSocket server
  //   const ws = new WebSocket("ws://your-websocket-url");
  //   ws.onopen = () => {
  //     ws.send(JSON.stringify(newMessage));
  //   };
  // };

  return <main className="flex flex-col h-dvh">
    <ClientMain decodeURLComponentName={decodeURLComponentName} sessionUser={session.user} /> 
      
    {/* <section className="bg-background/60  px-4  overflow-y-auto">
    </section> */}

  </main>
}