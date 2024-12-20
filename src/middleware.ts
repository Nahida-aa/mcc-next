import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';
import { NextResponse, type NextRequest } from 'next/server';

import { auth } from "@/app/(auth)/auth";


export default  auth(middleware)

// export default NextAuth(authConfig).auth;
async function middleware(
  req: NextRequest,
) {
  return NextResponse.next();
}
// export default middleware;

export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register'],
};
