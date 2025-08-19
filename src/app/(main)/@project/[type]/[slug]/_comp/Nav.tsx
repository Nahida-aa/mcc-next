"use client"

import { Tab, Tabs } from "@heroui/react";
import { useRouter } from "next/navigation";

const projectDetailsNavItems = [
  {
    key: "",
    label: "详情",
  },
  {
    key: "gallery",
    label: "画廊",
  },
  {
    key: "changelog",
    label: "更新日志",
  },
  {
    key: "/versions",
    label: "版本历史",
  }
] as const;
export const ProjectDetailsNav = ({type, slug}:
{type: string, slug: string}
) => {
  const router = useRouter()
  return <>
  <Tabs aria-label="Studio Navigation"  
        // selectedKey={pathname} 
        variant="light" color="primary"
        classNames={{
          base: "bg-card rounded-full mb-3",
          tab: "rounded-full",
          cursor: "rounded-full",
        }}
      >
  {projectDetailsNavItems.map((item) => {return (
            <Tab onClick={() => router.push(`/${type}/${slug}${item.key?`/${item.key}`:''}`)} className="rounded-full "
                key={item.key}
                title={
                  item.label
                }
              />
          )})}
      </Tabs>
  </>
}