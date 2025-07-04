"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChevronUp, ChevronDown } from "lucide-react"
import { UserRoleSwitcher } from "./UserRoleSwitcher"
import { Announcement, Announcement2, MinecraftAnnouncement } from "./Announcement"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { MinecraftTeamUpdates, MinecraftUpdatesSection, ProjectUpdates, TeamUpdates } from "./TeamUpdates"
import { ListIsExpandContextProvider } from "./ListWithSearchContext"
// import { ListWithSearch } from "../[slug]/_comp/ListWithSearch"
import { ClientListProjectParams } from "@/lib/types/project"
import { ProjectList } from "./ProjectList"
import { SearchBar } from "./SearchBar"
import { useStyle } from "@/components/context/styleContext"

export default function Main({
  type, page=1, sort="relevance", keyword, tags, game_versions, loaders, environment, is_open_source,
}: ClientListProjectParams) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { styleState } = useStyle();

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <main className="h-screen bg-[#8BC34A] w-full ">
      {/*  左侧宽度自适应内容，右侧占满剩余 */}
      <div className="h-full p-2 w-full flex gap-2 min-w-0 min-h-0">
        {/* 左列 */}
        <div className=" w-160 flex flex-col items-center ">

          {/* 区域 1 */}
          <MinecraftAnnouncement />
          {/* 区域 3 */}
          <UserRoleSwitcher className="flex-none bg-[#8B4513] rounded-md my-2  w-full " />

          {/* 区域 5 团队动态与项目动态 */}
          <MinecraftUpdatesSection />

        </div>

        {/* 右列 */}
        <div className="flex flex-1 flex-col">
          <ListIsExpandContextProvider>
            {/* 区域 4 - 项目列表区域 minecraft-list-container */}
            <Card
              className={`flex  transition-all duration-500  relative  py-0  ${
                isExpanded ? "h-[calc(100%-3.5rem)]" : "h-84"
              } ${
                styleState.border ? "border border-[#5D4037]  bg-[#BCAAA4] shadow-md" : "bg-transparent border-none shadow-none"
              }`}
            >
                {/* 展开/收缩按钮 */}
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggle}
                    className="bg-[#8D6E63] hover:bg-[#5D4037] text-white h-8 w-8 p-0 rounded minecraft-expand-btn"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </Button>
                </div>

                {/* 列表内容区域 */}
                <div className="flex-1 overflow-hidden p-0 min-h-0 m-2">
                  <ProjectList
                    type={type}
                    game_versions={game_versions}
                    is_open_source={is_open_source}
                    page={page}
                    sort={sort}
                    keyword={keyword}
                    tags={tags}
                    loaders={loaders}
                    environment={environment}
                  />
                </div>
            </Card>

            {/* 搜索栏区域 - 独立的卡片 */}
            <SearchBar
              type={type}
              keyword={keyword}
              onSearch={(newKeyword) => {
                // 处理搜索逻辑
                console.log("Search:", newKeyword)
              }}
              onTypeChange={(newType) => {
                // 处理类型切换逻辑
                console.log("Type changed:", newType)
              }}
            />

            {/* 区域 6 */}
            <Card
              className={`bg-[#D7CCC8] mt-2  border border-[#5D4037] transition-all duration-500 p-0  ${
                isExpanded ? "hidden" : "flex-1"
              }`}
            >
              <div className="bg-[#D7CCC8] rounded-md flex flex-col h-full ">

                <CardHeader className="p-4">
                  <h3 className="text-lg font-bold text-[#5D4037] minecraft-title text-center">推荐内容</h3>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <div className="space-y-3">
                    <div className="bg-[#EFEBE9] border border-[#8D6E63] rounded p-3">
                      <h4 className="font-bold text-[#5D4037] minecraft-text mb-2">🔥 热门模组推荐</h4>
                      <p className="text-sm text-[#795548] minecraft-text">
                        本周最受欢迎的模组，包含Create、JEI、Biomes O' Plenty等精品内容
                      </p>
                    </div>
                    <div className="bg-[#EFEBE9] border border-[#8D6E63] rounded p-3">
                      <h4 className="font-bold text-[#5D4037] minecraft-text mb-2">🎨 精美资源包</h4>
                      <p className="text-sm text-[#795548] minecraft-text">
                        高质量材质包和光影包，让你的Minecraft世界更加美丽
                      </p>
                    </div>
                    <div className="bg-[#EFEBE9] border border-[#8D6E63] rounded p-3">
                      <h4 className="font-bold text-[#5D4037] minecraft-text mb-2">🏗️ 建筑灵感</h4>
                      <p className="text-sm text-[#795548] minecraft-text">来自社区的精美建筑作品和建造教程分享</p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </ListIsExpandContextProvider>
        </div>
      </div>

      <style jsx global>{`
        .minecraft-list-container,
        .minecraft-search-container,
        .minecraft-card {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); 
          // 用 tailwind 写: 
          position: relative;
        }
        
        .minecraft-list-container::before,
        .minecraft-search-container::before,
        .minecraft-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          
          z-index: 0;
          border-radius: inherit;
        }
        
        .minecraft-inner {
          position: relative;
          z-index: 1;
        }
        
        .minecraft-title {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
        }
        
        .minecraft-text {
          font-family: 'Courier New', monospace;
        }
        
        .minecraft-expand-btn {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .minecraft-expand-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </main>
  )
}
