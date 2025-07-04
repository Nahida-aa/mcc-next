"use client"
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
// import Link from 'next/link';


const roleList = [
  { label: "游客", key: "guest", icon: "👤" },
  { label: "鉴赏家", key: "connoisseur", icon: "🎨" },
  { label: "创作者", key: "creator", icon: "✏️" },
  { label: "施工者", key: "developer", icon: "💻" },
  { label: "投资者", key: "investor", icon: "💼" },
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
            <span>{role.icon}</span><span>{role.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </section>
  // </Suspense >
  );
};
