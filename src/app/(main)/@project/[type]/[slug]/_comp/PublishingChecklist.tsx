"use client"

import { useState } from "react"
import { BetterTooltip } from "@/components/common/BetterTooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Asterisk, Check, ChevronRight, ChevronUp, Lightbulb, Scale } from "lucide-react"
import Link from "next/link"
import { ProjectDetail } from "@/server/apps/project/service"

export const PublishingChecklist = ({project,
}: {
  project: ProjectDetail 
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return <section className="bg-card p-4 rounded-lg mb-3">
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
    <section className={`flex items-center justify-between gap-6 ${isOpen ? 'mb-3' : ''} `} >
      <div className="flex flex-1 items-center justify-between">
        <h2>发布清单</h2>
        <div className="flex items-center">
          <span className="mr-1 font-bold">进展:</span>
          <div className="flex items-center gap-1">
            <BetterTooltip content={"上传版本"}>
              <div className="bg-mc size-8 rounded-full grid place-items-center"><Check size={16} className="text-[#3bdf64] " /></div>
            </BetterTooltip>
            <BetterTooltip content={"添加详情"}>
              <div className="bg-mc size-8 rounded-full grid place-items-center"><Asterisk  size={16} className="text-[#cb2245]" /></div>
            </BetterTooltip>
            <BetterTooltip content={"添加图标"}>
              <div className="bg-mc size-8 rounded-full grid place-items-center"><Lightbulb  size={16} className="text-[#8e32f3]" /></div>
            </BetterTooltip>
            <BetterTooltip content={"提交以进行审查"}>
              <div className="bg-mc size-8 rounded-full grid place-items-center"><Scale  size={16} className="text-[#e08325]" /></div>
            </BetterTooltip>
          </div>
        </div>
      </div>
      <CollapsibleTrigger className="bg-mc-light hover:bg-mc-light/50 hover:text-accent-foreground rounded-lg p-1 transition-colors size-8 grid place-items-center shadow-md">
        <ChevronUp 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : 'rotate-180'}`} 
          size={16}
        />
      </CollapsibleTrigger>
    </section>
    <CollapsibleContent className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-2">
      <section className="bg-mc p-4 rounded-lg flex flex-col gap-3">
        <h3 className="inline-flex"><Asterisk  size={16} className="text-[#cb2245]" />上传版本</h3>
        项目至少需要一个版本才能提交审核。
        <Link className="inline-flex" href={`/${project.type}/${project.slug}/versions`}>访问版本页面<ChevronRight/></Link>
      </section> 
      <section className="bg-mc p-4 rounded-lg flex flex-col gap-3">
        <h3 className="inline-flex"><Asterisk  size={16} className="text-[#cb2245]" />上传版本</h3>
        项目至少需要一个版本才能提交审核。
        <Link className="inline-flex" href={`/${project.type}/${project.slug}/versions`}>访问版本页面<ChevronRight/></Link>
      </section>  
      <section className="bg-mc p-4 rounded-lg flex flex-col gap-3">
        <h3 className="inline-flex"><Asterisk  size={16} className="text-[#cb2245]" />上传版本</h3>
        项目至少需要一个版本才能提交审核。
        <Link className="inline-flex" href={`/${project.type}/${project.slug}/versions`}>访问版本页面<ChevronRight/></Link>
      </section>
      <section className="bg-mc p-4 rounded-lg flex flex-col gap-3">
        <h3 className="inline-flex"><Asterisk  size={16} className="text-[#cb2245]" />上传版本</h3>
        项目至少需要一个版本才能提交审核。
        <Link className="inline-flex" href={`/${project.type}/${project.slug}/versions`}>访问版本页面<ChevronRight/></Link>
      </section>
      <section className="bg-mc p-4 rounded-lg flex flex-col gap-3">
        <h3 className="inline-flex"><Asterisk  size={16} className="text-[#cb2245]" />上传版本</h3>
        项目至少需要一个版本才能提交审核。
        <Link className="inline-flex" href={`/${project.type}/${project.slug}/versions`}>访问版本页面<ChevronRight/></Link>
      </section>
    </CollapsibleContent>
    </Collapsible>
  </section>
}