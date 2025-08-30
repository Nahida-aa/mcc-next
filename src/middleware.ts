import { auth } from "@/lib/auth";
// Error: You cannot define a route with the same specificity as a optional catch-all route ("/api" and "/api[[...route]]").
import { NextResponse, type NextRequest } from 'next/server';
import { headers } from "next/headers";
// import { jwtVerify } from 'jose';
// https://www.better-auth.com/docs/integrations/next#middleware
import { getCookieCache, getSessionCookie } from "better-auth/cookies";
// const SECRET = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);

// 需要认证的路由
const protectedRoutes = [
  // "/dashboard",
  // "/profile",
  // "/settings",
  // "/studio",
  // "/studio/notifications"
];

// 认证相关页面（已登录用户不应该访问）
// const authRoutes = [
//   "/login",
// ];
// 已登录用户访问登录页面时 将被重定向到的路由
const redirectAfterLogin = "/"
// 登录路由\未登录用户访问需要登录的页面时的重定向路由
const loginRoute = "/sign_in";

export async function middleware(req: NextRequest) {
  console.log('nextMiddleware:', req.nextUrl.pathname);
  console.log('Middleware headers:');
  console.log(Object.fromEntries(req.headers.entries()));
  const isRSC = req.headers.get('rsc');
  
  if (isRSC) {
    // 直接 next，不做 redirect
    return NextResponse.next();
  }
  try {
    // let isAuthenticated = false;
    // const token = req.cookies.get("better-auth.session_token")?.value
    // const session = await getCookieCache(req);
    // if (token) {
    //   // console.log('JWT Payload:', payload);
    // }
    // 仅检查 是否存在 session cookie
    const session = getSessionCookie(req);

    // const session = await auth.api.getSession({
    //   headers: await headers(), // pass the headers
    // });
    // console.log('Session:', session?.session);
    // isAuthenticated = !!session;
    // const isAuthenticated = true;
    // console.log('Is Authenticated:', isAuthenticated);

    // const isLoginRoute = pathname === loginRoute
    console.log('Middleware:', {  session });

    // 如果用户已登录但访问登录页面，重定向到 重定向路由(例如 /dashboard 或 /)
    // if (isAuthenticated && isLoginRoute) {
    //   console.log('Redirecting authenticated user to dashboard');
    //   return NextResponse.redirect(new URL(redirectAfterLogin, req.url));
    // }

    // 如果用户未登录但访问受保护的路由，重定向到登录页面
    if (!session) {
      console.log('Redirecting unauthenticated user to login');
      const loginUrl = new URL(loginRoute, req.url);
      // 添加回调参数，登录后可以重定向回原页面
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - image files (.png, .jpg, .svg, etc.)
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    '/studio/:path*'
    // {
    //   source:
    //     '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    //   has: [
    //     { type: 'header', key: 'next-router-prefetch' },
    //     { type: 'header', key: 'purpose', value: 'prefetch' },
    //   ],
    // },

    // {
    //   source:
    //     '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    //   has: [{ type: 'header', key: 'x-present' }],
    //   missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
    // },
  ],
}
