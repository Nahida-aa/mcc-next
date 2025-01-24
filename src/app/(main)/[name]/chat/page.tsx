import { SubHeader } from "@/components/layout/header/sub-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlignJustify } from "lucide-react"
import { useState } from "react"
import { MessageInput } from "./_comp/MessageInput"
import { ChatMain } from "./_comp/Client"

import { Loader } from "@/components/ui/loader/Loader"
import { redirect } from 'next/navigation'
import { db } from "@/lib/db"
import { user_table } from "@/lib/db/schema/user"
import { eq } from "drizzle-orm";
import { listMessageWithSender_by_chatId_cursor, listPrivateChatMessages } from "@/lib/db/q/user/msg"
import { getChat } from "@/lib/db/q/user/chat"
import { SWRProvider } from "@/components/providers/swr-provider"
import { server_auth } from "@/app/(auth)/auth"
import { MsgLsCursor } from "@/lib/routes/chats/messages"

export default async function AddFriendByNamePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  'use server'
  const { name } = await params
  console.log('name', name)
  const decodeURLComponentName = decodeURIComponent(name)
  const session = await server_auth()
  if (!session) return redirect('/sign-in')
  const [dbUser] = await db.select({
    id: user_table.id,
    name: user_table.name,
    email: user_table.email,
    image: user_table.image,
    nickname: user_table.nickname,
    status: user_table.status,
  }).from(user_table).where(eq(user_table.name, decodeURLComponentName))
  const chatForDB = await getChat(session.user.id, dbUser.id, 'user')
  // console.log('chat', chat)
  // const msgLs_forServer = await listPrivateChatMessages(session.user.id, dbUser.id, 0, 30)
  // console.log('msgLs_forServer', msgLs_forServer)
  const msgListKey = `/api/hono/chats/${chatForDB.id}/msgs/cursor`
  const chat_id = chatForDB.id

  const [msgList,]: [MsgLsCursor,] = await Promise.all([listMessageWithSender_by_chatId_cursor(chat_id),]);
  const fallback = {
    [msgListKey]: msgList
  }
  return <SWRProvider 
  value={{ fallback }}
  ><main className="flex flex-col h-dvh">
    <ChatMain decodeURLComponentName={decodeURLComponentName} sessionUser={session.user} targetUser_forServer={dbUser}
      msgListForDB={msgList}
      chatForDB={chatForDB}
    /> 
  </main>
  </SWRProvider>
}