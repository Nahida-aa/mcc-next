"use client";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type ChatView = 'home' | 'login' | 'signup' | 'forgot';

export const Chat = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams?.get('mode');
  
  // 内部状态管理，避免路由跳转
  const [currentView, setCurrentView] = useState<ChatView>('home');
  
  // 只在首次加载时根据路由设置初始状态
  useEffect(() => {
    const isLoginPage = pathname === '/login' || (pathname?.endsWith('/login') ?? false);
    if (isLoginPage) {
      switch (mode) {
        case 'signup':
          setCurrentView('signup');
          break;
        case 'forgot':
          setCurrentView('forgot');
          break;
        default:
          setCurrentView('login');
          break;
      }
    } else {
      setCurrentView('home');
    }
  }, [pathname, mode]);

  // 渲染不同的视图
  const renderContent = () => {
    switch (currentView) {
      case 'login':
      case 'signup':
      case 'forgot':
        return (
          <>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {currentView === 'signup' && '用户注册'}
                  {currentView === 'forgot' && '忘记密码'}
                  {currentView === 'login' && '用户登录'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('home')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  返回首页
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-full">
              {/* <LoginUI initialView={currentView === 'signup' ? 'sign_up' : currentView === 'forgot' ? 'forgot_password' : 'sign_in'} /> */}
            </CardContent>
            <CardFooter></CardFooter>
          </>
        );
      
      case 'home':
      default:
        return (
          <>
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold">社区聊天</h3>
            </CardHeader>
            <CardContent className="h-full flex flex-col justify-center items-center space-y-4">
              <div className="text-center space-y-4">
                <p className="text-gray-600 mb-6">
                  加入我们的 Minecraft 社区，与其他玩家交流讨论！
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => setCurrentView('login')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    size="lg"
                  >
                    登录账号
                  </Button>
                  
                  <Button
                    onClick={() => setCurrentView('signup')}
                    variant="outline"
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                    size="lg"
                  >
                    注册新账号
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  登录后即可参与聊天和社区活动
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="w-full text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setCurrentView('forgot')}
                  className="text-blue-500 hover:text-blue-700"
                >
                  忘记密码？
                </Button>
              </div>
            </CardFooter>
          </>
        );
    }
  };

  return renderContent();
}