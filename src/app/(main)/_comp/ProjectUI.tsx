"use client"

import { useStyle } from "@/components/context/styleContext"
import { Card } from "@/components/ui/card"
import { ProjectList } from "../@project/[type]/_comp/ProjectList"
import { SearchBar } from "../@project/[type]/_comp/SearchBar"
import { useListIsExpandContext } from "../@project/[type]/_comp/ListWithSearchContext"
import { ListProjectQuery } from "@/server/project/model"

export const ProjectUI = ({
  type, 
  offset, orderBy="relevance", q, categories, gameVersions, loaders, clientSide, serverSide, isOpenSource,
}: ListProjectQuery) => {
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
  </>
}