import { JSX } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const BetterTooltip = ({
  content,
  children, 
  delayDuration = 0,
  align = 'center',
  ...props
}: React.ComponentPropsWithoutRef<typeof Tooltip> & {
  content: JSX.Element | string;
  align?: 'center' | 'end' | 'start';
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip  {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="" align={align}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};