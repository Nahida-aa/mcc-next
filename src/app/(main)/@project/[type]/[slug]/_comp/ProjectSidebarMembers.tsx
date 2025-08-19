import { formatVersionsForDisplay } from "@/lib/utils/version"
import { ProjectDetail, ProjectMembers } from "@/server/apps/project/service"
import mc_data from "@/data/mc.json";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BookOpen, Code, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/components/aa/avatar_util";

export const ProjectSidebarMembers = ({
  members,
}: {
  members: ProjectMembers 
}) => {
  return <>
  {members && members.length > 0 && (
        <section className='bg-card p-4 space-y-3 rounded-lg shadow-sm'>
          <h2 className=''>成员</h2>
          <ul className="space-y-3">
            {members.map((member) => (
              <li key={member.id} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={getAvatarUrl(member.image, member.id)} />
                  <AvatarFallback>{member.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.username}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        )}</>
}