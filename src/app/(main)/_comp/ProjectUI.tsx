"use client"

import { useStyle } from "@/components/context/styleContext"
import { Card } from "@/components/ui/card"
import { ProjectList } from "../@project/[type]/_comp/ProjectList"
import { SearchBar } from "../@project/[type]/_comp/SearchBar"
import { useListIsExpandContext } from "../@project/[type]/_comp/ListWithSearchContext"
import { ClientListProjectParams } from "@/server/apps/project/type"

export const ProjectUI = ({
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
  </>
}