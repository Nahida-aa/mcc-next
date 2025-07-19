import { CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ReactNode } from "react"
import { SideNav } from "./_comp/sideNav"

export default function StudioLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <section className="min-h-0 w-full">
      {/* 桌面端布局 - 网格 */}
      <div className="grid grid-cols-[auto_1px_1fr]  h-full">
        {/* 侧边导航 */}
        <SideNav className="w-full" />
        
        {/* 分隔线 */}
        <Separator className="bg-border h-full" orientation="vertical" />
        
        {/* 主要内容区域 */}
        <ScrollArea hideScrollBar className="h-full">
          <CardContent className="p-4">
            {children}
          </CardContent>
        </ScrollArea>
      </div>
    </section>
  )
}
