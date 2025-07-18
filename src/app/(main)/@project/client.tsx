"use client"

import { useStyle } from "@/components/context/styleContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { ProjectList } from "../[type]/_comp/ProjectList"
import { SearchBar } from "../[type]/_comp/SearchBar"
import { useListIsExpandContext } from "../[type]/_comp/ListWithSearchContext"
import { ClientListProjectParams } from "@/lib/types/project"

export const Client = ({
  type, page=1, sort="relevance", keyword, tags, game_versions, loaders, environment, is_open_source,
}: ClientListProjectParams) => {
    const {state: isExpanded, setState: setIsExpanded} = useListIsExpandContext()
    const { styleState } = useStyle();
  return <>
   <Card // 区域 右1 - 项目列表区域 minecraft-list-container
      className={`flex relative py-0 overflow-hidden ${
        styleState.border ? "border border-[#5D4037] bg-[#BCAAA4] shadow-md" : "bg-transparent border-none shadow-none"
      }`}
    >
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

    <SearchBar // 搜索栏区域 右2 - 独立的卡片
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
  </>
}