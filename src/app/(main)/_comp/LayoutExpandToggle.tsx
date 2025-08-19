"use client"

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useListIsExpandContext } from "../@project/[type]/_comp/ListWithSearchContext";

export const LayoutExpandToggle = () => {
  const {state: isExpanded, setState: setIsExpanded} = useListIsExpandContext()
  
  return (
    <div className="absolute top-4 right-4 z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-[#8D6E63] hover:bg-[#5D4037] text-white hover:text-white h-8 w-8 p-0 rounded shadow-lg"
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </Button>
    </div>
  )
}
