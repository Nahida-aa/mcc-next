"use client"
// import { Button } from "@/components/ui/button"
import { Button } from "@heroui/react"
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export const NotLogin = () => {
  const router = useRouter()
  return <div className="space-y-3">
    <Button variant="shadow"
      onPress={() => {router.push('/sign_in')}}
      className="w-full bg-primary text-primary-foreground bg-linear-to-tr from-green-500 to-lime-500 hover:scale-105 "
      size="lg"
    >
      登录
    </Button>
    
    <Button
      onPress={() => {router.push('/sign_up')}}
      variant="ghost"
      className="w-full hover:scale-105 border-primary data-[hover=true]:!bg-linear-to-tr from-green-500 to-lime-500 text-primary hover:text-primary-foreground"
      size="lg"
    >
      创建我的家
    </Button>
  </div>
}