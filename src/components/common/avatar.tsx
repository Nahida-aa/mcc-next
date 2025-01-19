import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

export const ShadcnAvatar = ({ 
  src, size = 10, className = '', onclick,
}: {
  src: string;
  size?: number;
  className?: string;
  onclick?: () => void;
}) => {
  return (
    <Avatar className={`h-${size} w-${size} ${className}`} onClick={onclick}>
      <AvatarImage src={src} className={`h-${size} w-${size}`} />
      <AvatarFallback>
        <Skeleton className={`h-${size} w-${size} rounded-full`} />
      </AvatarFallback>
    </Avatar>
  );
}
