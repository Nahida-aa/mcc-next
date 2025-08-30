import { formatVersionsForDisplay } from "@/lib/utils/version"
import mcData from "@/data/mc.json";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BookOpen, Code, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/components/aa/avatar_util";
import { ProjectMemberBase } from "@/server/project/model/member";

export const ProjectSidebarMembers = ({
  members,
}: {
  members: ProjectMemberBase[] 
}) => {
  return <>
  {members && members.length > 0 && (
        <section className='bg-card p-4 space-y-3 rounded-lg shadow-sm'>
          <h2 className=''>成员</h2>
          <ul className="space-y-3">
            {members.map((member) => member.entity && (
              <li key={member.id} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={getAvatarUrl(member.entity.image, member.id)} />
                  <AvatarFallback>{member.entity.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.entity.username}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </li>
              )
            )}
          </ul>
        </section>
        )}</>
}