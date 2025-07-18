import { auth } from "@/lib/auth";
// Error: You cannot define a route with the same specificity as a optional catch-all route ("/api" and "/api[[...route]]").
import { NextResponse, type NextRequest } from 'next/server';

// 需要认证的路由
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
];

// 认证相关页面（已登录用户不应该访问）
// const authRoutes = [
//   "/login",
// ];
// 已登录用户将被重定向到的路由
const redirectAfterLogin = "/"
// 登录路由\未登录用户访问需要登录的页面时的重定向路由
const loginRoute = "/login";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  try {
    const session = await auth.api.getSession({
      query: {
          disableCookieCache: true,
      }, 
      headers: req.headers, // pass the headers
    });
    const isAuthenticated = !!session;
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    const isLoginRoute = pathname === loginRoute
    console.log('Middleware:', { pathname, isAuthenticated, isProtectedRoute, isLoginRoute });

    // 如果用户已登录但访问登录页面，重定向到 重定向路由(例如 /dashboard 或 /)
    if (isAuthenticated && isLoginRoute) {
      console.log('Redirecting authenticated user to dashboard');
      return NextResponse.redirect(new URL(redirectAfterLogin, req.url));
    }

    // 如果用户未登录但访问受保护的路由，重定向到登录页面
    else if (!isAuthenticated && isProtectedRoute) {
      console.log('Redirecting unauthenticated user to login');
      const loginUrl = new URL(loginRoute, req.url);
      // 添加回调参数，登录后可以重定向回原页面
      loginUrl.searchParams.set("callbackUrl", pathname);
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
