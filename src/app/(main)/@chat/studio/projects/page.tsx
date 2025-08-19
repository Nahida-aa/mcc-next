"use client"

import { Button } from "@heroui/react"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuthSession } from "@/components/providers/auth-provider"
import { NotLogin } from "../../_comp/notLogin"
import { useState } from "react"
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Download,
  Heart,
  MoreVertical,
  Calendar,
  Globe,
  Lock,
  EyeOff,
  Star,
  Archive,
  Trash2,
  FolderOpen
} from "lucide-react"
import { ProjectListItem } from "@/server/apps/project/type"
import NextImage from 'next/image'

export default function StudioProjectsPage() {
  const router = useRouter()
  const { data: session, status } = useAuthSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  if (!session) {
    router.push("/sign_in?callbackUrl=/studio/projects")
    return 
  }

  // 模拟项目数据
  const mockProjects: ProjectListItem[] = [
    {
      id: "1",
      type: "mod",
      slug: "optifine-hd",
      name: "OptiFine HD",
      summary: "Minecraft优化模组，提升游戏性能和画质",
      icon_url: "/project/icon/optifine.png",
      category: "优化",
      tags: ["性能", "光影", "优化"],
      game_versions: ["1.20.4", "1.20.1", "1.19.4"],
      loaders: ["forge", "fabric"],
      environment: "client",
      status: "published",
      is_open_source: false,
      license: "Custom",
      owner: {
        type: "user",
        id: session.user?.id || "1",
        name: session.user?.name || "You",
        username: session.user?.username || "you"
      },
      download_count: 45670,
      follow_count: 1200,
      createdAt: "2023-12-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      published_at: "2023-12-05T00:00:00Z",
      latest_version_number: "HD U I5",
      latest_version_id: "v1"
    },
    {
      id: "2",
      type: "resource_pack",
      slug: "faithful-32x",
      name: "Faithful 32x",
      summary: "高清材质包，保持原版风格",
      icon_url: "/project/icon/faithful.png",
      category: "材质",
      tags: ["材质包", "高清", "原版风格"],
      game_versions: ["1.20.4", "1.20.1"],
      loaders: ["vanilla"],
      environment: "client",
      status: "draft",
      is_open_source: true,
      license: "CC BY-SA 4.0",
      owner: {
        type: "user",
        id: session.user?.id || "1",
        name: session.user?.name || "You",
        username: session.user?.username || "you"
      },
      download_count: 0,
      follow_count: 45,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      latest_version_number: "1.0.0-beta",
      latest_version_id: "v2"
    },
    {
      id: "3",
      type: "mod",
      slug: "jei",
      name: "JEI 物品管理器",
      summary: "Just Enough Items - 物品查询和配方查看",
      icon_url: "/project/icon/jei.png",
      category: "实用工具",
      tags: ["物品", "配方", "查询", "JEI"],
      game_versions: ["1.20.4", "1.20.1", "1.19.4", "1.18.2"],
      loaders: ["forge", "fabric"],
      environment: "client",
      status: "published",
      is_open_source: true,
      license: "MIT",
      owner: {
        type: "user",
        id: session.user?.id || "1",
        name: session.user?.name || "You",
        username: session.user?.username || "you"
      },
      download_count: 123456,
      follow_count: 2300,
      createdAt: "2023-06-01T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
      published_at: "2023-06-15T00:00:00Z",
      latest_version_number: "15.2.0.27",
      latest_version_id: "v3"
    }
  ]

  // 过滤项目
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.summary.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "published") return matchesSearch && project.status === "published"
    if (activeTab === "draft") return matchesSearch && project.status === "draft"
    if (activeTab === "archived") return matchesSearch && project.status === "archived"
    
    return matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published": return <Globe className="w-4 h-4 text-green-600" />
      case "draft": return <Edit className="w-4 h-4 text-yellow-600" />
      case "private": return <Lock className="w-4 h-4 text-red-600" />
      case "archived": return <Archive className="w-4 h-4 text-gray-600" />
      default: return <EyeOff className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "published": return "已发布"
      case "draft": return "草稿"
      case "private": return "私有"
      case "archived": return "已归档"
      default: return "未知"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "mod": return "模组"
      case "resource_pack": return "资源包"
      case "data_pack": return "数据包"
      case "world": return "地图"
      case "mod_pack": return "整合包"
      case "plugin": return "插件"
      default: return "项目"
    }
  }

  const ProjectCard = ({ project }: { project: ProjectListItem }) => (
    <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* 项目图标 */}
        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          {project.icon_url ? (
            <NextImage
              src={project.icon_url}
              alt={project.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {project.name.charAt(0)}
            </div>
          )}
        </div>

        {/* 项目信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {getTypeText(project.type)}
                </Badge>
                <div className="flex items-center gap-1">
                  {getStatusIcon(project.status)}
                  <span className="text-xs text-muted-foreground">
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {project.summary}
              </p>
              
              {/* 标签和版本信息 */}
              <div className="flex flex-wrap gap-1 mb-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              {/* 统计信息 */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {project.download_count.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {project.follow_count.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push(`/projects/${project.slug}`)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push(`/studio/projects/${project.slug}/edit`)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <CardContent className="h-full p-6 space-y-6 overflow-y-auto">
      {/* 标题和创建按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">我的项目</h1>
          <p className="text-muted-foreground">管理你的所有项目</p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          variant="shadow"
          onPress={() => router.push("/studio/projects/create")}
        >
          <Plus className="w-4 h-4 mr-2" />
          创建项目
        </Button>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索项目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="bordered">
          <Filter className="w-4 h-4 mr-2" />
          筛选
        </Button>
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            全部 ({mockProjects.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            已发布 ({mockProjects.filter(p => p.status === "published").length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            草稿 ({mockProjects.filter(p => p.status === "draft").length})
          </TabsTrigger>
          <TabsTrigger value="archived">
            已归档 ({mockProjects.filter(p => p.status === "archived").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "未找到匹配的项目" : "还没有项目"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "尝试使用不同的搜索词" 
                  : "创建你的第一个项目来开始吧"
                }
              </p>
              {!searchTerm && (
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  variant="shadow"
                  onPress={() => router.push("/studio/projects/create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  创建项目
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </CardContent>
  )
}
