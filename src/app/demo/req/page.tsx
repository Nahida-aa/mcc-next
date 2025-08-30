import { Suspense } from 'react';

export default async function Page ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const { page = '1', sort = 'asc', query = '' } = await searchParams
  return <Suspense fallback={"Loading..."}>
    <h1>Page</h1>
    <p>This is the Page page.</p>
  </Suspense>
}