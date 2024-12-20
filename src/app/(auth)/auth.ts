// "use server";

import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
export const guestUserId = '93a35827-8b95-4a34-adec-1860657534df'

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ name, password }: any) {
        const users = await QUser.getByName(name);
        if (users.length === 0) return null;
        // biome-ignore lint: Forbidden non-null assertion.
        const passwordsMatch = await compare(password, users[0].password!);
        if (!passwordsMatch) return null;
        return users[0] as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }else {
        // 设置游客的 userId
        session.user = {
          id: guestUserId,
          email: 'guest@example.com',
          name: 'Guest',
        } as User;
      }

      return session;
    },
  },
});


import { cookies } from 'next/headers'
import { QUser } from '@/lib/db/q/qUser';
// import { redirect } from "next/navigation";

export async function server_auth(){
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  
  if (!token) {
    return null;
  }
  // 解密 token
  const payload = token.value.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/'); // 将 Base64 URL 安全编码转换为标准 Base64 编码
  const padding = '='.repeat((4 - (payload.length % 4)) % 4);
  const decodedPayload = atob(base64 + padding);
  const user = JSON.parse(decodedPayload);
  console.log(`app/(auth)/auth.ts::server_auth: user: ${JSON.stringify(user)}`);
  return { user:
    { id: user.id, name: user.name, email: user.email, image: user.image, nickname: user.nickname }
  };
}

export interface AuthConfig {
  /**
   * The base path of the Auth.js API endpoints.
   *
   * @default "/api/auth" in "next-auth"; "/auth" with all other frameworks
   */
  basePath?: string
}
export function createActionURL(
  action: string,
  protocol: string,
  headers: Headers,
  // envObject: any,
  config: Pick<AuthConfig, "basePath">
): URL {
  const basePath = config?.basePath ?? "api/auth"

  const detectedHost = headers.get("x-forwarded-host") ?? headers.get("host")
  const detectedProtocol = headers.get("x-forwarded-proto") ?? protocol ?? "https"
  const _protocol = detectedProtocol.endsWith(":")
    ? detectedProtocol
    : detectedProtocol + ":"

  let url = new URL(`${_protocol}//${detectedHost}`)
  const sanitizedUrl = url.toString().replace(/\/$/, "")

  if (basePath) {
    // remove leading and trailing slash
    const sanitizedBasePath = basePath?.replace(/(^\/|\/$)/g, "") ?? ""
    return new URL(`${sanitizedUrl}/${sanitizedBasePath}/${action}`)
  }
  return new URL(`${sanitizedUrl}/${action}`)
}