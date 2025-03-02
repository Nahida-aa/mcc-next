import { Suspense } from 'react';
import { Loading } from '~/components/ui/loading/Loading';

export default async function VAPage ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { page = '1', sort = 'asc', query = '' } = await searchParams
  return <Suspense fallback={<Loading />}>
    <h1>这里 aa ui</h1>
    <p>This is the VAPage page.</p>
    <p>Search query: {query}</p>
    <p>Current page: {page}</p>
    <p>Sort order: {sort}</p>
  </Suspense>
}