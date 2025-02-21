import { Suspense } from 'react';
import { Loader } from '~/components/ui/loading/Loading';
import { server_auth } from '~/app/(auth)/auth';
import { HomeHeader } from '~/components/layout/header/home-header';

const ModsPage = async () => {
  // const session = await server_auth();
  return (
    <Suspense fallback={<Loader />}>
      <div className='min-h-12' />
      {/* <HomeHeader user={session?.user} className='bg-card/80'  /> */}
      <h1>ModsPage</h1>
      <p>This is the ModsPage page.</p>
    </Suspense>
  );
}

export default ModsPage;