// "use server";
import { QUser } from '@/server/db/q/qUser';
import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
export const guestUserId = '93a35827-8b95-4a34-adec-1860657534df'

interface ExtendedSession extends Session {
  user: User;
}

interface Token {
  id?: string;
  [key: string]: any;
}
interface AuthorizeCredentials {
  name: string;
  password: string;
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
      credentials: {
        name: { label: "Name", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, unknown>, req: Request): Promise<User | null> {
        const { name, password } = credentials as unknown as AuthorizeCredentials;
        if (!name || !password) {
          return null;
        }
        // const name = credentials?.name as string;
        const users = await QUser.getByName(name);
        if (users.length === 0) return null;
        // biome-ignore lint: Forbidden non-null assertion.
        const passwordsMatch = await compare(password, users[0].password!);
        if (!passwordsMatch) return null;
        return users[0];
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
      token: Token;
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
import { NextApiRequest } from 'next';
import { verifyJWT } from '@/server/core/token';
import { SessionTokenPayload } from '@/server/middleware/auth';

// import { redirect } from "next/navigation";

export async function server_auth(){
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  
  if (!token) {
    return null;
  }
  let de_payload = null
  try{
    de_payload = await verifyJWT(token) as SessionTokenPayload
  } catch (error) {
    console.error(`app/(auth)/auth.ts::server_auth: token 解析失败: ${error}`);
    return null;
  }
  // // 解密 token
  // const payload = token.split('.')[1];
  // const base64 = payload.replace(/-/g, '+').replace(/_/g, '/'); // 将 Base64 URL 安全编码转换为标准 Base64 编码
  // const padding = '='.repeat((4 - (payload.length % 4)) % 4);
  // const decodedPayload = atob(base64 + padding);
  // const session_payload = JSON.parse(decodedPayload);
  // console.log(`app/(auth)/auth.ts::server_auth: payload: ${JSON.stringify(session_payload)}`);
  return { user: {
    id: de_payload?.user?.id,
    email: de_payload?.user?.email,
    name: de_payload?.user?.name,
    image: de_payload?.user?.image,
    nickname: de_payload?.user?.nickname,
  }};
};


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