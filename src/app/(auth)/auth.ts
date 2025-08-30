import { AuthSession } from '@/components/providers/auth-provider';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers'

export const serverAuth = async () => {
  const session = await auth.api.getSession({
     headers: await headers() // pass the headers
  })
  return session as AuthSession
}