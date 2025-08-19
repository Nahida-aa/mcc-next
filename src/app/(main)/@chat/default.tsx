"use client"
// import { Button } from "@/components/ui/button"
import { Button } from "@heroui/react"
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { NotLogin } from "./_comp/notLogin"
import { auth } from "@/lib/auth"
import { useAuthSession } from "@/components/providers/auth-provider"
import { useSignOut } from "@/components/providers/modal-provider"
import { LogOut } from "lucide-react"
import ChatUI from "./_comp/ChatUI"
import { ChatNav } from "./_comp/nav"

export default function ChatPage() {
  return <ChatNav><ChatUI /></ChatNav>
  // return null
}