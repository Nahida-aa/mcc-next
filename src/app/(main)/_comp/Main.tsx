"use client"

import { useState } from "react"
import { MinecraftAnnouncement } from "../[type]/_comp/Announcement"
import { MinecraftUpdatesSection } from "../[type]/_comp/TeamUpdates"
import { UserRoleSwitcher } from "../[type]/_comp/UserRoleSwitcher"
import { useStyle } from "@/components/context/styleContext"
import { ListIsExpandContextProvider, useListIsExpandContext } from "../[type]/_comp/ListWithSearchContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ProjectList } from "../[type]/_comp/ProjectList"
import { RightUI } from "./RightUI"

export const Main = ({
  projectUI,
  chatUI
}: {
  projectUI: React.ReactNode,
  chatUI: React.ReactNode
}) => {
  
  // const { styleState } = useStyle();
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
        <ListIsExpandContextProvider >
        <RightUI projectUI={projectUI} chatUI={chatUI} />
        </ListIsExpandContextProvider>
      </div>
    </main>
}