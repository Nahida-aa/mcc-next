"use client"

import { Button, ScrollShadow } from "@heroui/react"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuthSession } from "@/components/providers/auth-provider"
import { NotLogin } from "../_comp/notLogin"
import { 
  Plus, 
  FolderOpen, 
  Heart, 
  Bell, 
  BarChart3, 
  Users, 
  Settings,
  Upload,
  Star,
  Download,
  Eye,
  MessageSquare
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function StudioPage() {
  const router = useRouter()
  const { data: session, status } = useAuthSession()

  if (!session) {
    return (
      <CardContent className="h-full flex flex-col justify-center items-center space-y-4">
        <NotLogin />
      </CardContent>
    )
  }

  // 模拟数据
  const stats = {
    projects: 12,
    totalDownloads: 45670,
    totalViews: 123456,
    followers: 890,
    notifications: 3
  }

  const quickActions = [
    {
      title: "创建新项目",
      description: "上传 Mod、资源包或数据包",
      icon: Plus,
      action: () => router.push("/studio/projects/create"),
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "管理项目",
      description: "查看和编辑你的所有项目",
      icon: FolderOpen,
      action: () => router.push("/studio/projects"),
      color: "from-green-500 to-lime-500"
    },
    {
      title: "收藏管理",
      description: "管理你收藏的项目",
      icon: Heart,
      action: () => router.push("/studio/bookmarks"),
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "通知中心",
      description: "查看最新通知和消息",
      icon: Bell,
      action: () => router.push("/studio/notifications"),
      color: "from-purple-500 to-violet-500",
      badge: stats.notifications
    }
  ]

  const statsCards = [
    {
      title: "我的项目",
      value: stats.projects,
      icon: FolderOpen,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "总下载量",
      value: stats.totalDownloads.toLocaleString(),
      icon: Download,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "总浏览量",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "关注者",
      value: stats.followers,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ]

  return (<>

      {/* 欢迎区域 */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          欢迎回来，{session.user?.name || session.user?.displayUsername}! 👋
        </h1>
        <p className="text-muted-foreground">
          在这里管理你的项目、查看统计数据和处理通知
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="relative group">
              <Button
                className={`
                  w-full h-24 p-4 bg-gradient-to-r ${action.color} 
                  text-white hover:scale-105 transition-all duration-200
                  flex flex-col items-start justify-between
                `}
                variant="shadow"
                onPress={action.action}
              >
                <div className="flex items-center justify-between w-full">
                  <action.icon className="w-6 h-6" />
                  {action.badge && (
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>
            {/* 快捷操作 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="relative group">
              <Button
                className={`
                  w-full h-24 p-4 bg-gradient-to-r ${action.color} 
                  text-white hover:scale-105 transition-all duration-200
                  flex flex-col items-start justify-between
                `}
                variant="shadow"
                onPress={action.action}
              >
                <div className="flex items-center justify-between w-full">
                  <action.icon className="w-6 h-6" />
                  {action.badge && (
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 最近活动 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">最近活动</h2>
        <div className="space-y-3">
          {/* 模拟活动数据 */}
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Upload className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">OptiFine HD</span> 项目发布了新版本 1.20.4
              </p>
              <p className="text-xs text-muted-foreground">2小时前</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Star className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">JEI 物品管理器</span> 获得了 50 个新的关注
              </p>
              <p className="text-xs text-muted-foreground">1天前</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">用户 Steve</span> 在 <span className="font-medium">Biomes O' Plenty</span> 项目下评论
              </p>
              <p className="text-xs text-muted-foreground">3天前</p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部快捷链接 */}
      <div className="pt-4 border-t">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push("/studio/analytics")}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            统计分析
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push("/studio/settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            工作室设置
          </Button>
        </div>
      </div>

    </>
  )
}
