"use client"

import {
  BoxesIcon,
  BoxIcon,
  BracesIcon,
  CircleXIcon,
  EarthIcon,
  FolderKanbanIcon,
  GlassesIcon,
  HardDriveIcon,
  PaletteIcon,
  SearchIcon,
  UserRoundIcon,
  UsersRoundIcon,
  Ellipsis,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const typeList = [
  { label: "模组", key: "mod", icon: BoxIcon },
  { label: "资源包", key: "resource_pack", icon: PaletteIcon },
  { label: "光影", key: "shader", icon: GlassesIcon },
  { label: "数据包", key: "data_pack", icon: BracesIcon },
  { label: "整合包", key: "modpack", icon: BoxesIcon },
  { label: "地图", key: "world", icon: EarthIcon },
  { label: "团队", key: "group", icon: UsersRoundIcon },
  { label: "项目", key: "project", icon: FolderKanbanIcon },
  { label: "用户", key: "user", icon: UserRoundIcon },
  { label: "服务器", key: "server", icon: HardDriveIcon },
]

interface SearchBarProps {
  keyword?: string
}

export const SearchBar = ({ keyword = "" }: SearchBarProps) => {
  const router = useRouter()
  const pathParams = useParams<{ type: string }>()
  const type = pathParams?.type || "mod"
  const searchParams = useSearchParams()
  const [searchKeyword, setSearchKeyword] = useState(keyword)

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (searchKeyword.trim()) {
      params.set('keyword', searchKeyword.trim())
    } else {
      params.delete('keyword')
    }
    router.push(`/${type}?${params.toString()}`)
  }, [searchKeyword, type, router, searchParams])

  const handleTypeChange = useCallback((newType: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (searchKeyword.trim()) {
      params.set('keyword', searchKeyword.trim())
    }
    router.push(`/${newType}?${params.toString()}`)
  }, [searchKeyword, router, searchParams])

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#8B4513] rounded-md h-12 min-h-12 my-2 px-2">
      <div className="relative w-full md:w-80">
        <SearchIcon size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#795548]" />
        <Input
          placeholder="搜索需要的内容"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="pl-8 pr-8 border-[#8D6E63] bg-[#EFEBE9] text-[#5D4037] minecraft-text
          focus-visible:ring-1 focus-visible:ring-[#5D4037] 
          focus-visible:ring-offset-0 h-8 text-sm"
        />
        {searchKeyword && (
          <CircleXIcon
            size={16}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#795548] cursor-pointer hover:text-[#5D4037]"
            onClick={() => {
              setSearchKeyword("")
              const params = new URLSearchParams(searchParams?.toString() || '')
              params.delete('keyword')
              router.push(`/${type}?${params.toString()}`)
            }}
          />
        )}
      </div>

      <div className="flex items-center justify-end gap-1 min-w-fit">
        {/* 前6个类型 */}
        <ToggleGroup className="flex-wrap gap-1" type="single" value={type || "mod"} onValueChange={handleTypeChange}>
          {typeList.slice(0, 6).map((item) => {
            const Icon = item.icon
            return (
              <ToggleGroupItem
                key={item.key}
                value={item.key}
                aria-label={item.label}
                className="minecraft-toggle gap-1 bg-[#D7CCC8] border-[#8D6E63] data-[state=on]:bg-[#EFEBE9] data-[state=on]:text-green-400 h-8 px-2 text-xs"
              >
                <Icon className="w-3 h-3 mr-1" />
                <span className="minecraft-text">{item.label}</span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>

        {/* 2xl及以上显示所有剩余类型 */}
        <div className="hidden 2xl:flex">
          <ToggleGroup className="flex-wrap gap-1" type="single" value={type || "mod"} onValueChange={handleTypeChange}>
            {typeList.slice(6).map((item) => {
              const Icon = item.icon
              return (
                <ToggleGroupItem
                  key={item.key}
                  value={item.key}
                  aria-label={item.label}
                  className="minecraft-toggle gap-1 bg-[#D7CCC8] border-[#8D6E63] data-[state=on]:bg-[#8D6E63] data-[state=on]:text-white h-8 px-2 text-xs"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  <span className="minecraft-text">{item.label}</span>
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </div>

        {/* 2xl以下显示下拉菜单 */}
        <div className="block 2xl:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`minecraft-toggle border-[#8D6E63] h-8 px-2 text-xs ${
                  typeList.slice(6).some((item) => item.key === type)
                    ? "bg-[#8D6E63] text-white"
                    : "bg-[#D7CCC8]  text-[#5D4037]"
                }`}
              >
                {typeList.slice(6).find((item) => item.key === type) ? (
                  <>
                    {(() => {
                      const selectedItem = typeList.find((item) => item.key === type)
                      const Icon = selectedItem?.icon
                      return Icon ? <Icon className="w-3 h-3 mr-1" /> : null
                    })()}
                    <span className="minecraft-text">{typeList.find((item) => item.key === type)?.label}</span>
                  </>
                ) : (
                  <Ellipsis className="w-3 h-3" strokeWidth={3} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#EFEBE9] border-2 border-[#8D6E63]" align="end">
              {typeList.slice(6).map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem 
                    key={item.key} 
                    onClick={() => handleTypeChange(item.key)}
                    className={`flex items-center gap-2 minecraft-text cursor-pointer text-xs ${
                      type === item.key ? "bg-[#8D6E63] text-white" : "text-[#5D4037] hover:bg-[#D7CCC8]"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <style jsx global>{`
        .minecraft-text {
          font-family: 'Courier New', monospace;
        }
        
        .minecraft-toggle {
          font-family: 'Courier New', monospace;
        }
      `}</style>
    </div>
  )
}
