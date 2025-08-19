import { ScrollArea } from "@/components/ui/scroll-area";
import { getProjectDetail, listProjectMember } from "@/server/apps/project/service";
import { notFound } from "next/navigation";
import { ProjectSidebarCompatibility } from './_comp/ProjectSidebarCompatibility';
import { ProjectSidebarLinks } from './_comp/ProjectSidebarLinks';
import { ProjectSidebarMembers } from './_comp/ProjectSidebarMembers';
import { ProjectSidebarOtherInfo } from './_comp/ProjectSidebarOtherInfo';
import { ProjectDetailsNav } from './_comp/Nav';
import { ProjectHeader } from "./_comp/ProjectHeader";
import { server_auth } from "@/app/(auth)/auth";
import { PublishingChecklist } from "./_comp/PublishingChecklist";

export default async function Layout({
  children, 
  params,
}: {
  children: React.ReactNode, 
  params: Promise<{ type: string, slug: string }>
}) {
  const { type, slug: src_slug } = await params;
  const slug = decodeURIComponent(src_slug);
  console.log('Parsed slug:', slug);
  // 获取项目数据
  const project = await getProjectDetail(type, slug)
  if (!project)  notFound();
  // 获取项目成员
  const members = await listProjectMember(type, slug);

  const session = await server_auth()
  const isMember = session?.user?.id === project.owner_id;

  return <section aria-label='Project' className="flex overflow-y-auto  p-1 px-5  rounded-2xl  bg-mc">
    <ScrollArea hideScrollBar  className="w-full h-full ">
    <ProjectHeader project={project} />

    <template data-note="TODO:成员可见区域
    "></template>
    {isMember && (<PublishingChecklist project={project} />)}

    <template data-note="主要内容区域, 均可见
    "></template>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <template data-note="主要内容
      "></template>
      <section className="lg:col-span-2 space-y-6">
        <ProjectDetailsNav type={type} slug={slug} />
        {children}
      </section>

      <template data-note=" 右侧信息栏
      兼容性:Minecraft,Platforms,Supported environments; ,link; 成员; Details:Licensed,Published,Updated
      "></template>
      <aside aria-label='Detail-side' className="space-y-3">
        <ProjectSidebarCompatibility project={project} />
        <ProjectSidebarLinks project={project} />
        <ProjectSidebarMembers members={members} />
        <ProjectSidebarOtherInfo project={project} />
      </aside>
    </div>
    </ScrollArea>
  </section>
}