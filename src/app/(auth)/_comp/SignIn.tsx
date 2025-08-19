"use client"
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs"
import {Tabs, Tab} from "@heroui/react";
import { PasswordSignIn } from "./PasswordSignIn"
import { PhoneNumberOTPSignIn } from "./PhoneNumberOTPSignIn"
import { Suspense, useEffect } from "react";
import { useAuthSession } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";

export function SignIn() {
  const { data: session, status, update } = useAuthSession()
  const router = useRouter()
  
  // 使用 useEffect 来处理路由跳转，避免在渲染期间执行副作用
  useEffect(() => {
    if (session && status === "authenticated") {
      router.push("/")
    }
  }, [session, status, router])

  // 如果用户已经登录，显示加载状态或空内容
  if (session && status === "authenticated") {
    return null
  }
  return (<Suspense >
    <Tabs variant="underlined" className="w-full flex justify-center" color="primary">
        <Tab key="phone" title="验证码登录" className="pb-0">
          <PhoneNumberOTPSignIn />
        </Tab>
        <Tab key="password" title="密码登录" className="pb-0 Tab">
          <PasswordSignIn   />
        </Tab>
    </Tabs>
  </Suspense>
    // <div className="w-full">
      
    //   {/* 导航链接 */}
    //   <div className="mt-6 text-center space-y-2">
    //     <div>
    //       <span className="text-gray-600 text-sm">还没有账号？</span>
    //       <button 
    //         onClick={() => setShowSignUp(true)}
    //         className="text-blue-500 hover:text-blue-700 text-sm ml-1"
    //       >
    //         立即注册
    //       </button>
    //     </div>
    //     {onForgotPassword && (
    //       <div>
    //         <button 
    //           onClick={onForgotPassword}
    //           className="text-blue-500 hover:text-blue-700 text-sm"
    //         >
    //           忘记密码？
    //         </button>
    //       </div>
    //     )}
    //   </div>
    // </div>
  )
}