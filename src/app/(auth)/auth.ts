import { auth } from '@/lib/auth';
import { headers } from 'next/headers'

export const server_auth = async () => {
  const headersList = await headers();
  return await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: headersList // pass the headers
  });
}