import { notFound } from 'next/navigation';
import NextImage from 'next/image';
import { Suspense } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Heart, 
  Eye, 
  Calendar, 
  User, 
  Globe, 
  Github, 
  ExternalLink,
  Star,
  AlertTriangle,
  Info,
  Users,
  Package,
  Image as ImageIcon,
  TagsIcon,
  EllipsisVertical,
  Code,
  BookOpen
} from 'lucide-react';
import { getProjectDetail, listProjectMember } from '@/server/apps/project/service';
import { SearchBar } from '../_comp/SearchBar';
import { querySchema } from '@/app/(main)/page';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAvatarUrl } from '@/components/aa/avatar_util';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BetterTooltip } from '@/components/common/BetterTooltip';
import { formatSize } from '@/app/aa/or';
import mc_data from "@/data/mc.json";
import { formatVersionsForDisplay } from '@/lib/utils/version';
import { ProjectSidebarCompatibility } from './_comp/ProjectSidebarCompatibility';
import { ProjectSidebarLinks } from './_comp/ProjectSidebarLinks';
import { ProjectSidebarMembers } from './_comp/ProjectSidebarMembers';
import { ProjectSidebarOtherInfo } from './_comp/ProjectSidebarOtherInfo';
import { ProjectDetailsNav } from './_comp/Nav';

// 模拟获取项目数据的函数
async function getProjectData(type: string, slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/projects/${type}/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
}

// 项目类型的显示名称映射
const typeDisplayNames = {
  mod: '模组',
  resourcePack: '资源包',
  dataPack: '数据包',
  shader: '光影包',
  world: '地图',
  project: '项目'
};

// 加载状态组件
function ProjectLoading() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


import { MDXRemote } from 'next-mdx-remote-client/rsc'
import { serverAuth } from '@/app/(auth)/auth';

export default async function ProjectPage({ params, searchParams

}: {
  params: Promise< {
    type: 'mod' | 'resourcePack' | 'dataPack' | 'shader' | 'world' | 'project';
    slug: string;
  }>
  searchParams: Promise<
  {
    role?: string;
    mode?: string;
    type?: string;
    page?: string;
    sort?: string;
    keyword?: string;
    tags?: string;
    gameVersions?: string;
    loaders?: string;
    environment?: string;
    isOpenSource?: string;
  }>
}) {
  const { type, slug: srcSlug } = await params;
  const slug = decodeURIComponent(srcSlug);
  console.log('Parsed slug:', slug);
  // 将 url 的 slug 转
    // const { role, ...itemSearchParams } = await searchParams
    // console.log("ProjectListPageUI:searchParams:", role)
    // const parsedQuery = querySchema.parse(itemSearchParams);
    // console.log("ProjectListPageUI:parsedQuery: ", parsedQuery)
  const queryType = 'mod'
  
  
  // 获取项目数据
  const project = await getProjectDetail(type, slug)
  if (!project)  notFound();
  // 获取项目成员
  const members = await listProjectMember(type, slug);

  return (<section aria-label='ProjectDetail' className=" p-4 max-w-6xl rounded-2xl  bg-card">
    <article className='markdown-body' >
    {project.description && (
    <MDXRemote source={project.description} />
    )}
    </article>
    {/* {project.description} */}
  </section>);
}
