"use client"
// import { Button } from "@/components/ui/button"
import { Button } from "@heroui/react"
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const router = useRouter()
  return <div className="space-y-3">
        <Button variant="shadow"
          onPress={() => {router.push('/sign_in')}}
          className="w-full bg-primary text-primary-foreground bg-linear-to-tr from-green-500 to-lime-500 hover:scale-105 "
          size="lg"
        >
          修改信息
        </Button>
                <Button variant="shadow"
          onPress={() => {router.push('/sign_in')}}
          className="w-full bg-primary text-primary-foreground bg-linear-to-tr from-green-500 to-lime-500 hover:scale-105 "
          size="lg"
        >
          提出建议
        </Button>       
        <Button variant="shadow"
          onPress={() => {router.push('/sign_in')}}
          className="w-full bg-primary text-primary-foreground bg-linear-to-tr from-green-500 to-lime-500 hover:scale-105 "
          size="lg"
        >
          开通钱包
        </Button>
        <Button variant="shadow"
          onPress={() => {router.push('/sign_out')}}
          className="w-full bg-primary text-primary-foreground bg-linear-to-tr from-green-500 to-lime-500 hover:scale-105 "
          size="lg"
        >
          退出登录
        </Button>
      </div>
}