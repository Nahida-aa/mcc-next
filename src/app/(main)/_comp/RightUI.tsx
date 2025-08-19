import { Card } from "@/components/ui/card";
import { useListIsExpandContext } from "../@project/[type]/_comp/ListWithSearchContext";
import { SearchBar } from "../@project/[type]/_comp/SearchBar";

export const RightUI = ({
  projectUI,
  chatUI
}: {
  projectUI: React.ReactNode;
  chatUI: React.ReactNode;
}) => {
  const {state:isExpanded, setState:setIsExpanded} = useListIsExpandContext()
  
  return <div 
    className={`flex-1 grid transition-all duration-500 pt-2 ${
      isExpanded 
        ? "grid-rows-[1fr_3rem_0fr] pb-2" 
        : "grid-rows-[22rem_auto_1fr]"
    } max-h-[calc(100%-0.5rem)]`}
  >
            {projectUI} {/* 区域 右1 */}
            <SearchBar // 搜索栏区域 右2 - 独立的卡片
            /> 
            {/* 区域 右3 */}
            <Card
              className={`border-0   transition-all duration-500 p-0 overflow-hidden flex flex-col ${
                isExpanded ? "opacity-0 mt-0" : "opacity-100"
              }`}
            >
              {chatUI}
            </Card>
        </div>
}