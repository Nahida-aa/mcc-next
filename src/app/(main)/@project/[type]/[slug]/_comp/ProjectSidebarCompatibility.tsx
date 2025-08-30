import { formatVersionsForDisplay } from "@/lib/utils/version"
import mcData from "@/data/mc.json";
import { Badge } from "@/components/ui/badge";
import { ProjectSelect } from "@/server/admin/db/service";

export const ProjectSidebarCompatibility = ({
  project,
}: {
  project: ProjectSelect
}) => {
  return <>
  {(project.gameVersions.length || project.loaders.length || project.clientSide || project.serverSide) && (
    <section className='bg-card p-4 space-y-3 rounded-lg shadow-sm'>
      <h2 className=''>兼容性</h2>
      {project.gameVersions && project.gameVersions.length > 0 && (
      <section className='space-y-2'>
        <h3 className='text-gray-800'>Minecraft: Java Edition</h3>
        <div className='flex flex-wrap gap-1'>
          {formatVersionsForDisplay(project.gameVersions, mcData.gameVersions).map((version: string) => (
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
      {(project.clientSide || project.serverSide) && (
      <section className='space-y-2'>
        <h3 className='text-gray-800'>环境</h3>
        <div className="space-y-1 px-1">
          {project.clientSide && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">客户端</span>
              <span>{project.clientSide}</span>
            </div>
          )}
          {project.serverSide && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">服务端</span>
              <span>{project.serverSide}</span>
            </div>
          )}
        </div>
      </section>
      )}
    </section>
    )}
  </>        
}
