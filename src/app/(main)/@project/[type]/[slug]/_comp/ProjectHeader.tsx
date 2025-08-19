import { ProjectDetail } from "@/server/apps/project/service"
import { Download, EllipsisVertical, Heart, Package, Star, TagsIcon } from "lucide-react"
import NextImage from 'next/image';
import { Badge } from '@/components/ui/badge';
import { BetterTooltip } from "@/components/common/BetterTooltip";
import { formatSize } from "@/app/aa/or";
import { Button } from "@/components/ui/button";

export const ProjectHeader = ({
  project,
}: {
  project: ProjectDetail
}) => {
  return <div aria-label='Header' className="grid grid-cols-1 gap-x-8 gap-y-6 border-0 border-b border-solid border-divider pb-4 my-4 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-row gap-4">
          {project.icon_url ? (
            <NextImage 
              src={project.icon_url} 
              alt={project.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center border">
              <Package className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <div  className="flex flex-col gap-1" aria-label='ProjectBaseInfo'>
            <div className='flex gap-4'>
              <h2 className="text-2xl leading-none font-bold ">{project.name}</h2>
              <Badge variant={project.status === 'approved' ? 'default' : 'outline'}>
                {project.status}
              </Badge>
            </div>
            <p className=" line-clamp-2 ">{project.summary}</p>
            <div className="mt-auto flex flex-wrap gap-4 empty:hidden" >
              <BetterTooltip content={`${project.download_count.toString()} 下载`}  >
                <div className='flex items-center gap-2 border-0 border-r border-solid border-divider pr-4 font-semibold cursor-help'><Download className="size-6 text-secondary-foreground" /> {formatSize(project.download_count)}</div>
              </BetterTooltip>
              <BetterTooltip content={`${project.follow_count.toString()} 点赞`}  >
                <div className='flex items-center gap-2 border-0 border-r border-solid border-divider pr-4 font-semibold cursor-help'><Heart className="size-6 text-secondary-foreground" /> {formatSize(project.follow_count)}</div>
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