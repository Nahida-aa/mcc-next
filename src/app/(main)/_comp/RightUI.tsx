import { Card } from "@/components/ui/card";
import { useListIsExpandContext } from "../[type]/_comp/ListWithSearchContext";

export const RightUI = ({
  projectUI,
  chatUI
}: {
  projectUI: React.ReactNode;
  chatUI: React.ReactNode;
}) => {
  const {state:isExpanded, setState:setIsExpanded} = useListIsExpandContext()
  
  return <div className={`flex-1 grid transition-all duration-500 ${
          isExpanded 
            ? "grid-rows-[1fr_auto_0fr]" 
            : "grid-rows-[22rem_auto_1fr]"
        } `}>
            {projectUI}

            {/* 区域 右3 */}
            <Card
              className={`border-0  mt-2  transition-all duration-500 p-0 overflow-hidden flex flex-col ${
                isExpanded ? "opacity-0 mt-0" : "opacity-100"
              }`}
            >
              {chatUI}
            </Card>
        </div>
}