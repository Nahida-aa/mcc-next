"use client"
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { BriefcaseBusiness, Pickaxe, ScanSearch, UserRound, WandSparkles } from 'lucide-react';
// import Link from 'next/link';


const roleList = [
  { label: "游客", key: "guest", icon: UserRound },
  { label: "鉴赏家", key: "connoisseur", icon: ScanSearch },
  { label: "创作者", key: "creator", icon: WandSparkles },
  { label: "施工者", key: "developer", icon: Pickaxe },
  { label: "投资者", key: "investor", icon: BriefcaseBusiness },
];

export const UserRoleSwitcher = ({
  className = '',
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams?.get('role') || "guest"; // 默认角色为 "guest"
  const [value, setValue] = useState(role)

  const onValueChange = (value: string) => {
    setValue(value)
    console.log("onValueChange" , value)
    router.push(`?role=${value}`)
  }

  return (
  // <Suspense fallback={<LoadingS />} >
    <section className={`h-fit z-1 ${className}`} >
      <ToggleGroup className='min-w-fit w-full h-12 z-1' type="single" value={value||"guest"} onValueChange={onValueChange}>
        {roleList.map((role) => (
          <ToggleGroupItem key={role.key} value={role.key} aria-label={role.label} className='m-2 h-8 p-0 rounded-md data-[state=off]:bg-amber-500 z-1'>
            <span>{<role.icon />}</span><span>{role.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </section>
  // </Suspense >
  );
};
