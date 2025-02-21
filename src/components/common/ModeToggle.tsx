"use client"

import * as React from "react"
import { Moon, MoonIcon, MoonStar, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { cn } from "~/lib/utils"

export function ModeToggleMenu({
  variant = "outline",
  className = "",
}:{ variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null 
  className?: string
}) {
  const { setTheme } = useTheme() 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className={cn(`${className}`)}>
          <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" size={16} />
          <MoonStar className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" size={16}  />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const  ModeToggle = ({
  variant = "outline",
  className = "",
}:{ variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null 
  className?: string 
}) => {
  const { theme, setTheme } = useTheme()

  const onClick = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  } // 57:5  Error: Expected an assignment or function call and instead saw an expression.  @typescript-eslint/no-unused-expressions

  return (
    <Button variant={variant} size="icon" className={` ${className}`} onClick={onClick}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
