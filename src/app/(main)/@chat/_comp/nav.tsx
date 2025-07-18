"use client"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, Settings, Coffee, MessageSquare, Building } from 'lucide-react'
import { useAuthSession } from "@/components/providers/auth-provider"
import NextImage from 'next/image';
import { User } from "@/components/aa/User"

export const ChatNav = ({children,
}:{
  children:React.ReactNode;
}) => {
  const pathname = usePathname()
  const router = useRouter()
    const { data: session,
      status, update
    } = useAuthSession()
  
  // 导航项配置
  const topNavItems = [
    { 
      label: '个人工作室', 
      path: '/studio', 
      icon: Settings, 
      description: '个人设置和工具',
      badge: '2' // 未读消息数
    },
    { 
      label: '客厅', 
      path: '/lounge', 
      icon: Coffee, 
      description: '休闲聊天区域' 
    },
    { 
      label: '更衣室', 
      path: '/dressing', 
      icon: Users, 
      description: '角色扮演区域',
      badge: 'New'
    },
  ]

  const bottomNavItems = [
    { 
      label: '团队会议室', 
      path: '/meeting', 
      icon: MessageSquare, 
      description: '团队协作空间',
      badge: '5'
    },
    { 
      label: '平台大厅', 
      path: '/', 
      icon: Home, 
      description: '主页面' 
    },
    { 
      label: '平台人力', 
      path: '/hr', 
      icon: Building, 
      description: '人力资源管理' 
    },
  ]

  const NavButton = ({ item, isActive }: { item: typeof topNavItems[0], isActive: boolean }) => (
    <div className="relative group">
      <Button 
        variant={isActive ? "default" : "ghost"} 
        onClick={() => router.push(item.path)}
        className={`
          m-0 transition-all duration-200 flex items-center gap-2
          ${isActive 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'hover:bg-muted hover:text-foreground'
          }
          group-hover:scale-105
        `}
        title={item.description}
      >
        <item.icon className="w-4 h-4" />
        <span className="hidden sm:inline">{item.label}</span>
        {item.badge && (
          <Badge 
            variant={isActive ? "secondary" : "outline"} 
            className="ml-1 px-1 py-0 text-xs h-5 min-w-5"
          >
            {item.badge}
          </Badge>
        )}
      </Button>
      {/* Tooltip for mobile */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none sm:hidden z-10">
        {item.description}
      </div>
    </div>
  )

  return <>
    {/* 顶部导航 */}
    <CardHeader className="p-1 flex-row justify-between items-center bg-card border-b space-y-0">
      <User image={session?.user?.image} status={session ? "online" : "offline"} displayName={session?.user?.displayUsername} email={session?.user?.email} className="ml-1" />

      
      <div className="flex items-center gap-1">
        {topNavItems.map((item, index) => (
          <div key={item.path} className="flex items-center">
            <NavButton 
              item={item} 
              isActive={pathname === item.path} 
            />
            {index < topNavItems.length - 1 && (
              <Separator orientation="vertical" className="mx-1 h-6" />
            )}
          </div>
        ))}
      </div>
    </CardHeader>
    
    <Separator className="bg-border" />
    
    {/* 主要内容区域 */}
    <div className="flex-1 bg-background text-foreground">
      {children}
    </div>
    
    <Separator className="bg-border" />
    
    {/* 底部导航 */}
    <CardFooter className="p-1 flex justify-center items-center bg-card border-t">
      <div className="flex items-center gap-1">
        {bottomNavItems.map((item, index) => (
          <div key={item.path} className="flex items-center">
            <NavButton 
              item={item} 
              isActive={pathname === item.path} 
            />
            {index < bottomNavItems.length - 1 && (
              <Separator orientation="vertical" className="mx-1 h-6" />
            )}
          </div>
        ))}
      </div>
      
      <div className="ml-auto mr-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-xs text-muted-foreground">V2.1.0</span>
      </div>
    </CardFooter>
  </>
}