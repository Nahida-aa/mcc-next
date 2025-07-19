"use client"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, Settings, Coffee, MessageSquare, Building, LayoutDashboard, Menu } from 'lucide-react'
import { useAuthSession } from "@/components/providers/auth-provider"
import NextImage from 'next/image';
import { User } from "@/components/aa/User"
import { useState } from 'react'

export const ChatNavGrid = ({children,
}:{
  children:React.ReactNode;
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status, update } = useAuthSession()
  
  // 导航项配置
  const topNavItems = [
    { 
      label: '个人工作室', 
      path: '/studio', 
      icon: LayoutDashboard, 
      description: '通知, 统计分析, 项目管理, 收藏管理...',
      badge: '2'
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

  const NavButton = ({ item, isActive, compact = false }: { 
    item: typeof topNavItems[0], 
    isActive: boolean,
    compact?: boolean 
  }) => (
    <div className="relative group">
      <Button 
        variant={isActive ? "default" : "ghost"} 
        onClick={() => {
          router.push(item.path)
          setIsMobileMenuOpen(false) // 移动端点击后关闭菜单
        }}
        className={`
          transition-all duration-200 flex items-center gap-2 w-full justify-start
          ${isActive 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'hover:bg-muted hover:text-foreground'
          }
          ${compact ? 'h-8 px-2 text-xs' : 'h-10 px-3'}
          group-hover:scale-105
        `}
        title={item.description}
      >
        <item.icon className={compact ? "w-3 h-3" : "w-4 h-4"} />
        <span className={compact ? "text-xs" : "text-sm"}>
          {compact ? item.label.substring(0, 4) : item.label}
        </span>
        {item.badge && (
          <Badge 
            variant={isActive ? "secondary" : "outline"} 
            className={`ml-auto px-1 py-0 text-xs h-4 min-w-4 ${compact ? 'text-[10px]' : ''}`}
          >
            {item.badge}
          </Badge>
        )}
      </Button>
      
      {/* 桌面端 Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block z-10">
        {item.description}
      </div>
    </div>
  )

  return (
    <div className="h-full grid grid-rows-[auto_1px_1fr_1px_auto] bg-background">
      {/* 顶部导航 - 复杂响应式网格 */}
      <CardHeader className="p-2 bg-card border-b">
        {/* 桌面端布局 */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_2fr_1fr] items-center gap-4">
          {/* 左侧用户信息 */}
          <User 
            image={session?.user?.image} 
            status={session ? "online" : "offline"} 
            displayName={session?.user?.displayUsername} 
            email={session?.user?.email} 
            className="justify-self-start"
          />
          
          {/* 中间导航按钮 */}
          <div className="justify-self-center">
            <div className="grid grid-cols-3 gap-2 items-center">
              {topNavItems.map((item, index) => (
                <div key={item.path} className="flex items-center">
                  <NavButton item={item} isActive={pathname === item.path} />
                  {index < topNavItems.length - 1 && (
                    <Separator orientation="vertical" className="ml-2 h-6" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 右侧预留空间 */}
          <div className="justify-self-end"></div>
        </div>

        {/* 平板端布局 */}
        <div className="hidden md:grid lg:hidden md:grid-cols-[auto_1fr_auto] items-center gap-3">
          <User 
            image={session?.user?.image} 
            status={session ? "online" : "offline"} 
            displayName={session?.user?.displayUsername} 
            email={session?.user?.email} 
            className="justify-self-start"
          />
          
          <div className="justify-self-center">
            <div className="grid grid-cols-3 gap-1">
              {topNavItems.map((item) => (
                <NavButton 
                  key={item.path} 
                  item={item} 
                  isActive={pathname === item.path} 
                  compact 
                />
              ))}
            </div>
          </div>
          
          <div className="justify-self-end"></div>
        </div>

        {/* 移动端布局 */}
        <div className="md:hidden">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
            <User 
              image={session?.user?.image} 
              status={session ? "online" : "offline"} 
              displayName="" 
              email="" 
              className="justify-self-start"
            />
            
            <div className="justify-self-center text-sm font-medium">
              {topNavItems.find(item => pathname === item.path)?.label || '导航'}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="justify-self-end"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
          
          {/* 移动端下拉菜单 */}
          {isMobileMenuOpen && (
            <div className="mt-2 p-2 border rounded-lg bg-card shadow-lg">
              <div className="grid gap-1">
                {topNavItems.map((item) => (
                  <NavButton 
                    key={item.path} 
                    item={item} 
                    isActive={pathname === item.path} 
                    compact 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <Separator className="bg-border" />
      
      {/* 主要内容区域 */}
      <div className="overflow-auto bg-background min-h-0">
        {children}
      </div>
      
      <Separator className="bg-border" />
      
      {/* 底部导航 - 响应式网格 */}
      <CardFooter className="p-2 bg-card border-t">
        {/* 桌面端和平板端 */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto] items-center w-full gap-4">
          <div className="justify-self-center">
            <div className="grid grid-cols-3 gap-1 lg:gap-2 items-center">
              {bottomNavItems.map((item, index) => (
                <div key={item.path} className="flex items-center">
                  <NavButton 
                    item={item} 
                    isActive={pathname === item.path} 
                    compact={window.innerWidth < 1024}
                  />
                  {index < bottomNavItems.length - 1 && (
                    <Separator orientation="vertical" className="ml-2 h-6 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="justify-self-end flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">V2.1.0</span>
          </div>
        </div>

        {/* 移动端底部导航 */}
        <div className="md:hidden w-full">
          <div className="grid grid-cols-3 gap-1">
            {bottomNavItems.map((item) => (
              <NavButton 
                key={item.path} 
                item={item} 
                isActive={pathname === item.path} 
                compact 
              />
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground">V2.1.0</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </div>
  )
}
