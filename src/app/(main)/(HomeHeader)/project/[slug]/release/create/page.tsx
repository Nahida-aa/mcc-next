
import { Suspense } from 'react';
import { Loading } from '~/components/ui/loading/Loading';
import { MainComp } from './client';

const ProjectReleaseCreatePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  console.log(`ProjectReleaseCreatePage`)
  const slug = (await params).slug
  return (
    <Suspense fallback={<Loading />}>
      <div className='h-12'></div>
      <MainComp slug={slug} />
    </Suspense>
  );
}

export default ProjectReleaseCreatePage;