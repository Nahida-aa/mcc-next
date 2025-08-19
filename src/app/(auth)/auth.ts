import { auth } from '@/lib/auth';
import { headers } from 'next/headers'

export const serverAuth = async () => {
  const headersList = await headers();
  return await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: headersList // pass the headers
  });
}