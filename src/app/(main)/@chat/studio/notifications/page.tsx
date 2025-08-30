import { serverAuth } from "@/app/(auth)/auth";
import { NoStyleLink } from "@/components/aa/Link";
import { DoubleIcon } from "@/components/aa/ui/DoubleIcon";
import { listNotification } from "@/server/notification/service";
import { Box, Calendar, Check, UserPlus, X } from "lucide-react";
import { redirect } from "next/navigation";
import NextImage from 'next/image';
import { Image } from "@/components/image/Image";
import { buildImage } from "@/components/aa/User";
import Link from "next/link";
import { notificationType, NotificationType } from "@/server/notification/model";
import { getProjectBaseById } from "@/server/project/service";
import { Button } from "@/components/ui/button";

const analysisNotificationContent = async (type: string, content: Record<string, any>) => {
  switch (type) {
    case notificationType.invite_project_member:
      const projectId = content.projectId as string
      const project = await getProjectBaseById(projectId);
      return { text: '邀请你加入', icon: project.icon, slug: project.slug, name: project.name };
  }
  return { text: '', slug: '' }
}

export default async function NotificationsPage() {
  const session = await serverAuth();
  if (!session) redirect("/sign_in"); // 服务端直接 307 跳转
  const ret = await listNotification(session.user.id);
  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4">通知</h2>
      <ul className="flex flex-col gap-3">
        {ret.map(async (notification) => {
          const sender = notification.sender;
          const analysis = await analysisNotificationContent(notification.type, notification.content);
          const imgLink = analysis.slug ? `/project/${analysis.slug}` : '#';
          return sender && <li key={notification.id} className="bg-[#ebebeb] rounded-lg p-5 flex flex-col gap-2">
            <div className="flex items-center gap-3 ">
              <NoStyleLink href={imgLink}>
                <DoubleIcon primary={
                  analysis.icon ? <Image src={analysis.icon} alt="project icon" width={40} height={40} className="rounded-md" /> : <Box size={40} strokeMiterlimit={1.5} strokeWidth={1.25} />
                } secondary={<UserPlus size={16} />} />
              </NoStyleLink>
              <span className="flex-1 flex items-center gap-1">
                <Link href={sender ? `/user/${sender.username}` : '#'}
                  className="flex items-center gap-2">
                  <NextImage src={buildImage(sender?.image, sender?.username)} alt="u" width={24} height={24} className="rounded-full" />
                  <span className="font-bold">{sender.username}</span>
                </Link>
                <span>{analysis.text}</span>
                <Link href={imgLink} className="font-bold">{analysis.name}</Link>.
              </span>
            </div>
            <div className="flex gap-2">
              {/* TODO: */}
              <Button className="rounded-xl leading-none size-fit"><Check />同意</Button>
              <Button variant={"destructive"} className="rounded-xl leading-none size-fit"><X />拒绝</Button>
            </div>

            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar size={16} />
              {new Date(notification.createdAt).toLocaleString()} 收到</p>
            <p>{JSON.stringify(notification.content)}</p>
          </li>
        })}
      </ul>
    </section>
  )
};