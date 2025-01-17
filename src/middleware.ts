import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';
import { NextResponse, type NextRequest } from 'next/server';

import { auth, server_auth } from "@/app/(auth)/auth";


export default auth(middleware)

// export default NextAuth(authConfig).auth;
async function middleware(
  req: NextRequest,
) {
  console.log(`app/(auth)/middleware.ts: middleware: req: ${JSON.stringify(req)}`);
  const session = await server_auth();
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  return NextResponse.next();
}
// export default middleware;

export const config = {
  matcher: [
    // '/', 
    // '/:id', 
    // '/api/:path*', 
    // '/login', 
    // '/register', 
    '/user/status'],
};
