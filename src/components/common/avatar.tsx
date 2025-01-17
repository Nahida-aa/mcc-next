import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

export const ShadcnAvatar = ({ 
  src, size = 10, className = '' 
}: {
  src: string;
  size?: number;
  className?: string;
}) => {
  return (
    <Avatar className={`h-${size} w-${size} ${className}`}>
      <AvatarImage src={src} className={`h-${size} w-${size}`} />
      <AvatarFallback>
        <Skeleton className={`h-${size} w-${size} rounded-full`} />
      </AvatarFallback>
    </Avatar>
  );
}
