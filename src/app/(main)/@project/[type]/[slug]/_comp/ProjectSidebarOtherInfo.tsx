import { formatVersionsForDisplay } from "@/lib/utils/version"
import { ProjectDetail, ProjectMembers } from "@/server/apps/project/service"
import mcData from "@/data/mc.json";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BookOpen, Code, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/components/aa/avatar_util";

export const ProjectSidebarOtherInfo = ({
  project,
}: {
  project: ProjectDetail 
}) => {
  return <>
  <section className='bg-card p-4 space-y-3 rounded-lg shadow-sm'>
          <h2 className=''>其他信息</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">许可证</span>
              <span>{project.license||"未知"}</span>
            </div>
            {project.publishedAt ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">发布时间</span>
              <span>{new Date(project.publishedAt).toLocaleDateString('zh-CN')}</span>
            </div>
            ) : (
            <div className="flex justify-between">
              <span className="text-muted-foreground">创建时间</span>
              <span>{new Date(project.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
            )}
            { project.updatedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">更新时间</span>
              <span>{new Date(project.updatedAt).toLocaleDateString('zh-CN')}</span>
            </div>
            )}
          </div>
        </section></>
}