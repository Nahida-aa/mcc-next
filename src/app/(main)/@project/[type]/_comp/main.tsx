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
import { ClientListProjectParams } from "@/server/project/type"
import { ProjectList } from "./ProjectList"
import { SearchBar } from "./SearchBar"
import { useStyle } from "@/components/context/styleContext"
import LoginUI from "@/app/(auth)/login"
import { Chat } from "./Chat"
import { ListProjectQuery } from "@/server/project/model"

export default function Main({
  type, offset, orderBy="relevance", q, categories, gameVersions, loaders, clientSide, serverSide, isOpenSource,
}: ListProjectQuery) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { styleState } = useStyle();

  return <main className="h-screen bg-[#8BC34A] w-full ">
      {/*  左侧宽度自适应内容，右侧占满剩余 */}
      <div className="h-full p-2 w-full flex gap-2 min-w-0 min-h-0">
        {/* 左列 */}
        <div className=" w-160 flex flex-col items-center ">
          {/* 区域 左1 */}
          <MinecraftAnnouncement />
          {/* 区域 左2 */}
          <UserRoleSwitcher className="flex-none bg-[#8B4513] rounded-md my-2  w-full " />

          {/* 区域  左3 团队动态与项目动态 */}
          <MinecraftUpdatesSection />

        </div>

        {/* 右列 - 使用 Grid 布局 */}
        <div className={`flex-1 grid transition-all duration-500 ${
          isExpanded 
            ? "grid-rows-[1fr_auto_0fr]" 
            : "grid-rows-[22rem_auto_1fr]"
        } `}>
          <ListIsExpandContextProvider>
            {/* 区域 右1 - 项目列表区域 minecraft-list-container */}
            <Card
              className={`flex relative py-0 overflow-hidden ${
                styleState.border ? "border border-[#5D4037] bg-[#BCAAA4] shadow-md" : "bg-transparent border-none shadow-none"
              }`}
            >
                {/* 展开/收缩按钮 */}
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={()=>setIsExpanded(!isExpanded)}
                    className="bg-[#8D6E63] hover:bg-[#5D4037] text-white hover:text-white h-8 w-8 p-0 rounded "
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </Button>
                </div>

                {/* 列表内容区域 */}
                <div className="flex-1 overflow-hidden p-0 min-h-0 m-2">
                  <ProjectList
                    type={type}
                    gameVersions={gameVersions}
                    isOpenSource={isOpenSource}
                    q={q}
                    offset={offset}
                    orderBy={orderBy}
                    categories={categories}
                    clientSide={clientSide}
                    loaders={loaders}
                    serverSide={serverSide}
                  />
                </div>
            </Card>

            {/* 搜索栏区域 右2 - 独立的卡片 */}
            <SearchBar
              // type={type}
              keyword={q}
              // onSearch={(newKeyword) => {
              //   // 处理搜索逻辑
              //   console.log("Search:", newKeyword)
              // }}
              // onTypeChange={(newType) => {
              //   // 处理类型切换逻辑
              //   console.log("Type changed:", newType)
              // }}
            />

            {/* 区域 右23 */}
            <Card
              className={`bg-[#D7CCC8] mt-2 border border-[#5D4037] transition-all duration-500 p-0 overflow-hidden flex flex-col ${
                isExpanded ? "opacity-0 mt-0" : "opacity-100"
              }`}
            >
              <Chat />
            </Card>
          </ListIsExpandContextProvider>
        </div>
      </div>
    </main>
}
