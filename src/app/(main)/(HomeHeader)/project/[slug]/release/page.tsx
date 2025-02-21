import { Suspense } from 'react';
import { Loading } from '~/components/ui/loading/Loading';
import { ProjectHeader } from './_comp/ProjectHeader';
import { PublishingChecklist } from './_comp/PublishingChecklist';
import { UploadRelease } from './_comp/ReleaseList';

const ProjectReleasePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const slug = (await params).slug
  return (
    <Suspense fallback={<Loading />}>
      <ProjectHeader />
      <h1>{slug}</h1>
      <PublishingChecklist />
      <UploadRelease slug={slug} />
    </Suspense>
  );
}

export default ProjectReleasePage;