"use client"
import { Tab, Tabs } from "@heroui/react"
import { BarChart3, Bell, Building2, DollarSign, LayoutList, Star, FolderOpen } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

// 导航项配置 - 统一管理
const sideNavItems = [
  {
    key: "/studio",
    icon: LayoutList,
    label: "概要",
    description: "工作室总览",
    badge: null
  },
  {
    key: "/studio/notifications",
    icon: Bell,
    label: "通知",
    description: "消息和通知",
    badge: "3" // 未读通知数
  },
  {
    key: "/studio/analytics",
    icon: BarChart3,
    label: "分析",
    description: "数据统计",
    badge: null
  },
  {
    key: "/studio/projects",
    icon: FolderOpen,
    label: "项目",
    description: "项目管理",
    badge: "12" // 项目数
  },
  {
    key: "/studio/organizations",
    icon: Building2,
    label: "团队",
    description: "团队管理",
    badge: null
  },
  {
    key: "/studio/collections",
    icon: Star,
    label: "收藏",
    description: "收藏管理",
    badge: "45" // 收藏数
  },
  {
    key: "/studio/revenue",
    icon: DollarSign,
    label: "收入",
    description: "收入统计",
    badge: "New"
  }
] as const

interface SideNavProps {
  className?: string
}

export const SideNav = ({ className = '' }: SideNavProps) => {
  // const pathname = usePathname()
  const router = useRouter()
  
  return (
    <div className={`h-full ${className}`}>
      <Tabs aria-label="Studio Navigation" 
        isVertical 
        // selectedKey={pathname} 
        variant="light" color="primary"
        classNames={{
          base: "h-full",
        }}
      >
        {sideNavItems.map((item) => {
          return (
            <Tab onClick={() => router.push(item.key)}
              key={item.key}
              title={
                <div className="flex items-center justify-between w-full min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <item.icon className={`
                      w-4 h-4 flex-shrink-0  duration-200
                    `} />
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className={`
                        text-sm font-medium truncate
                      `}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                </div>
              }
            />
          )
        })}
      </Tabs>
    </div>
  )
}