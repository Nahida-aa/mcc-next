import Link from 'next/link';
import { Suspense } from 'react';
import { server_auth } from '~/app/(auth)/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Loading } from '~/components/ui/loading/Loading';
import { listProjectByUser } from '~/lib/db/q/project/get';
import { DemoList } from './_comp/DemoList';
import { ProjectList } from './_comp/ProjectList';
import {ScrollShadow} from "@heroui/scroll-shadow";

const  ProjectListPage = async () => {
  const session = await server_auth();
  if (!session?.user) {
    return null; // TODO: redirect to login
  }
  const projects = await listProjectByUser(session.user.id);
  return (
    <Suspense fallback={<Loading />}>
      <section className='mt-12'>
      <ScrollShadow hideScrollBar className="h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>You can edit multiple projects at once by selecting them below.</CardDescription>
          </CardHeader>
          <CardContent>
            <DemoList />
            <ProjectList />
            <ul>
              {projects.map((project) => (
                <li key={project.id}>
                  <Link href={`/project/${project.slug}`}>
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        </ScrollShadow>
      </section>
    </Suspense>
  );
}

export default ProjectListPage;
