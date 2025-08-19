"use client"

import { MinecraftAnnouncement } from "../@project/[type]/_comp/Announcement"
import { MinecraftUpdatesSection } from "../@project/[type]/_comp/TeamUpdates"
import { UserRoleSwitcher } from "../@project/[type]/_comp/UserRoleSwitcher"
import { RightUI } from "./RightUI"

export const Main = ({
  projectUI,
  chatUI
}: {
  projectUI: React.ReactNode,
  chatUI: React.ReactNode
}) => {
  
  // const { styleState } = useStyle();
  // bg-[url(/bg/house.png)] bg-center bg-cover
  return <main className="h-screen   bg-background   w-full">
      {/*  左侧宽度自适应内容，右侧占满剩余 backdrop-blur-sm */}
      <div className="h-full px-2 w-full flex gap-2 min-w-0  min-h-0">
        {/* 左列 */}
        <div className="py-2 w-160 flex flex-col items-center ">
          {/* 区域 左1 */}
          <MinecraftAnnouncement />
          {/* 区域 左2 */}
          <UserRoleSwitcher className="flex-none bg-[#8B4513] rounded-md my-2  w-full " />

          {/* 区域  左3 团队动态与项目动态 */}
          <MinecraftUpdatesSection />

        </div>

        {/* 右列 - 使用 Grid 布局 */}
        <RightUI projectUI={projectUI} chatUI={chatUI} />
      </div>
    </main>
}