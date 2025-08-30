import { Box, Download, EllipsisVertical, Heart, Package, Star, TagsIcon } from "lucide-react"
import NextImage from 'next/image';
import { Badge } from '@/components/ui/badge';
import { BetterTooltip } from "@/components/common/BetterTooltip";
import { formatSize } from "@/app/aa/or";
import { Button } from "@/components/ui/button";
import { ProjectSelect } from "@/server/admin/db/service";

export const ProjectIcon = ({ icon, name, size }: { icon?: string|null; name: string, size: number }) => {
  return icon ? (
    <NextImage 
      src={icon} 
      alt={name}
      width={size}
      height={size}
      className="w-24 h-24 rounded-lg object-cover border"
    />
  ) : (
    <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center border">
      <Box className="text-muted-foreground" size={size} />
    </div>
  )
}

export const ProjectHeader = ({
  project,
}: {
  project: ProjectSelect
}) => {
  return <div aria-label='Header' className="grid grid-cols-1 gap-x-8 gap-y-6 border-0 border-b border-solid border-divider pb-4 my-4 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-row gap-4">
          <ProjectIcon icon={project.icon} name={project.name} size={96} />
          
          <div  className="flex flex-col gap-1" aria-label='ProjectBaseInfo'>
            <div className='flex gap-4'>
              <h2 className="text-2xl leading-none font-bold ">{project.name}</h2>
              <Badge variant={project.status === 'approved' ? 'default' : 'outline'}>
                {project.status}
              </Badge>
            </div>
            <p className=" line-clamp-2 ">{project.summary}</p>
            <div className="mt-auto flex flex-wrap gap-4 empty:hidden" >
              <BetterTooltip content={`${project.downloadCount.toString()} 下载`}  >
                <div className='flex items-center gap-2 border-0 border-r border-solid border-divider pr-4 font-semibold cursor-help'><Download className="size-6 text-secondary-foreground" /> {formatSize(project.downloadCount)}</div>
              </BetterTooltip>
              <BetterTooltip content={`${project.followCount.toString()} 点赞`}  >
                <div className='flex items-center gap-2 border-0 border-r border-solid border-divider pr-4 font-semibold cursor-help'><Heart className="size-6 text-secondary-foreground" /> {formatSize(project.followCount)}</div>
              </BetterTooltip>
              <div className="flex flex-wrap items-center gap-2">
                <TagsIcon className="size-6 text-secondary-foreground" />
              {project.categories?.map((category: string) => (
                <Badge key={category} variant="outline">{category}</Badge>
              ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button size="lg" className="rounded-2xl [&_svg]:size-6 p-4" variant="default" >
            <Download  />
            下载
          </Button>
          <Button variant="secondary" size="icon" className='rounded-full [&_svg]:size-6'>
            <Heart  />
          </Button>
          <Button variant="secondary" size="icon" className='rounded-full [&_svg]:size-6'>
            <Star  />
          </Button>
          <Button variant="ghost" size="icon" className='rounded-full [&_svg]:size-6 text-secondary-foreground'>
            <EllipsisVertical  />
          </Button>
        </div>
      </div>
}