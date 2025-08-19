import { formatVersionsForDisplay } from "@/lib/utils/version"
import { ProjectDetail } from "@/server/apps/project/service"
import mc_data from "@/data/mc.json";
import { Badge } from "@/components/ui/badge";

export const ProjectSidebarCompatibility = ({
  project,
}: {
  project: ProjectDetail
}) => {
  return <>
  {(project.game_versions.length || project.loaders.length || project.client_side || project.server_side) && (
    <section className='bg-card p-4 space-y-3 rounded-lg shadow-sm'>
      <h2 className=''>兼容性</h2>
      {project.game_versions && project.game_versions.length > 0 && (
      <section className='space-y-2'>
        <h3 className='text-gray-800'>Minecraft: Java Edition</h3>
        <div className='flex flex-wrap gap-1'>
          {formatVersionsForDisplay(project.game_versions, mc_data.gameVersions).map((version: string) => (
            <Badge key={version} variant="secondary" className="text-xs ">
              {version}
            </Badge>
          ))}
        </div>
      </section>
      )}
      {project.loaders && project.loaders.length > 0 && (
      <section className='space-y-2'>
        <h3 className='text-gray-800'>加载器</h3>
        <div className="flex flex-wrap gap-1">
          {project.loaders.map((loader: string) => (
            <Badge key={loader} variant="secondary" className="text-xs ">
              {loader}
            </Badge>
          ))}
        </div>
      </section>
      )}
      {(project.client_side || project.server_side) && (
      <section className='space-y-2'>
        <h3 className='text-gray-800'>环境</h3>
        <div className="space-y-1 px-1">
          {project.client_side && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">客户端</span>
              <span>{project.client_side}</span>
            </div>
          )}
          {project.server_side && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">服务端</span>
              <span>{project.server_side}</span>
            </div>
          )}
        </div>
      </section>
      )}
    </section>
    )}
  </>        
}
