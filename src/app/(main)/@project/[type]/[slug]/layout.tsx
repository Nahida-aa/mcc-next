import { ScrollArea } from "@/components/ui/scroll-area";
import { getProjectDetail } from "@/server/project/service";
import { notFound } from "next/navigation";
import { ProjectSidebarCompatibility } from './_comp/ProjectSidebarCompatibility';
import { ProjectSidebarLinks } from './_comp/ProjectSidebarLinks';
import { ProjectSidebarMembers } from './_comp/ProjectSidebarMembers';
import { ProjectSidebarOtherInfo } from './_comp/ProjectSidebarOtherInfo';
import { ProjectDetailsNav } from './_comp/Nav';
import { ProjectHeader } from "./_comp/ProjectHeader";
import { serverAuth } from "@/app/(auth)/auth";
import { PublishingChecklist } from "./_comp/PublishingChecklist";
import { listProjectMember, listProjectMemberBase } from "@/server/project/service/member";

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
  const project = await getProjectDetail(slug)
  if (!project)  notFound();
  // 获取项目成员
  const members = await listProjectMemberBase(project.id);

  const session = await serverAuth()
  const isMember = session?.user?.id === project.ownerId;

  return <section aria-label='Project' className="flex overflow-y-auto  p-1 px-5  rounded-2xl  bg-mc">
    <ScrollArea hideScrollBar  className="w-full h-full ">
    <ProjectHeader project={project} />

    <template data-note="TODO:成员可见区域
    "></template>
    {isMember && (<PublishingChecklist project={project} />)}

    <template data-note="主要内容区域, 均可见
    "></template>
    <div className="grid  gap-3">
      <template data-note="主要内容
      "></template>
      <section className=" space-y-6">
        <ProjectDetailsNav type={type} slug={slug} />
        {children}
      </section>
    </div>
    </ScrollArea>
  </section>
}