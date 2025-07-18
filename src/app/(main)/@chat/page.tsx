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

export default function ChatPage() {
  const router = useRouter()
  const showSignOut = useSignOut()
  const { data: session,
    status, update
  } = useAuthSession()

  if (!session) {
    return <CardContent className="h-full flex flex-col justify-center items-center space-y-4"><NotLogin /></CardContent>
  }

  return <>
  <CardContent className="h-full flex flex-col justify-center items-center space-y-4">
      <div className="space-y-3">
        <Button variant="shadow"
          // onPress={() => {router.push('/sign_in')}}
          className="w-full bg-primary text-primary-foreground bg-linear-to-tr from-green-500 to-lime-500 hover:scale-105 "
          size="lg"
        >
          修改信息
        </Button>
                <Button variant="shadow"
          // onPress={() => {router.push('/sign_in')}}
          className="w-full bg-primary text-primary-foreground bg-linear-to-tr from-green-500 to-lime-500 hover:scale-105 "
          size="lg"
        >
          提出建议
        </Button>       
        <Button variant="shadow"
          // onPress={() => {router.push('/sign_in')}}
          className="w-full bg-primary text-primary-foreground bg-linear-to-tr from-green-500 to-lime-500 hover:scale-105 "
          size="lg"
        >
          开通钱包
        </Button>
        <Button variant="shadow"
          onPress={() => showSignOut()} startContent={<LogOut className="w-4 h-4" />}
          className="w-full bg-primary text-primary-foreground bg-linear-to-tr from-green-500 to-lime-500 hover:scale-105 "
          size="lg"
        >
          退出登录
        </Button>
      </div>
  </CardContent>
  </>
}