import { formatVersionsForDisplay } from "@/lib/utils/version"
import { ProjectDetail } from "@/server/apps/project/service"
import mc_data from "@/data/mc.json";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BookOpen, Code, ExternalLink } from "lucide-react";

export const ProjectSidebarLinks = ({
  project,
}: {
  project: ProjectDetail
}) => {
  return <>
        {(project.source_url|| project.issues_url || project.wiki_url || project.discord_url) && (
          <section className='bg-card p-4 space-y-3 rounded-lg shadow-sm'>
            <h2 className=''>链接</h2>
            <div className="space-y-2 px-1">
              {project.source_url && (
                <a href={project.source_url} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2 hover:underline'>
                  <Code size={16} />源代码 <ExternalLink size={16} />
                </a>
              )}
              {project.issues_url && (
                <a href={project.issues_url} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2 hover:underline'>
                  <AlertTriangle size={16} />问题反馈 <ExternalLink size={16} />
                </a>
              )}
              {project.wiki_url && (<a href={project.wiki_url} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2 hover:underline'>
                  <BookOpen size={16} />Wiki <ExternalLink size={16} />
                </a>
              )}
            </div>
          </section>
          )}
  </>
}