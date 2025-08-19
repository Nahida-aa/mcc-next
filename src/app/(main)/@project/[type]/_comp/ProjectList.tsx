"use client"

import { Suspense, useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {ScrollShadow} from "@heroui/scroll-shadow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { filterProjects } from "@/data/mock-projects"
import Image from "next/image"
import type { ClientListProjectParams, ProjectListItem } from "@/server/apps/project/type"
import { useStyle } from "@/components/context/styleContext"
import Link from "next/link";

const ProjectCard = ({ project }: { project: ProjectListItem }) => {
  const { styleState } = useStyle();
  return (
    <Card className={`  bg-[#D7CCC8] hover:bg-[#BCAAA4] transition-all duration-200 p-2 gap-1 ${
                styleState.border ? "border-2 border-[#8D6E63] bg-[#D7CCC8] shadow-md" : " border-none shadow-none"
              } border-none`}>
      <CardHeader className="p-0 pb-2">
        <div className="flex items-start gap-3">
          <Link href={`/${project.type}/${project.slug}`}>
          <Image
            src={project.iconUrl || "/placeholder.svg"}
            alt={project.name}
            width={48}
            height={48}
            className="rounded "
          />
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/${project.type}/${project.slug}`}>
            <CardTitle className="text-sm font-bold text-[#5D4037]  truncate">{project.name}</CardTitle>
            </Link>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-[#8D6E63] text-[#5D4037] px-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-xs text-[#5D4037]  line-clamp-2">{project.summary}</p>
      </CardContent>
    </Card>
  )
}

export const ProjectList = ({
  type,
  page = 1,
  sort = "relevance",
  keyword,
  tags,
  gameVersions,
  loaders,
  environment,
  isOpenSource,
}: ClientListProjectParams) => {
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const filtered = filterProjects({
      type,
      limit: 40,
      offset: (page - 1) * 20,
      sort,
      keyword,
      tags,
      gameVersions,
      loaders,
      environment,
      isOpenSource,
    })
    setProjects(filtered)
    setLoading(false)
  }, [type, page, sort, keyword, tags, gameVersions, loaders, environment, isOpenSource])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className=" h-full ">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-[#795548]">加载中...</div>
          </div>
        ) : (
          <ScrollArea hideScrollBar  className="h-full ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 p-1">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-8">
                <div className="text-[#795548] ">没有找到相关项目</div>
              </div>
            )}
          </ScrollArea>
        )}
      </div>
    </Suspense>
  )
}
