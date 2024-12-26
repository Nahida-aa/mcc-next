import { Hono } from 'hono'
import { handle } from 'hono/vercel'
export const dynamic = 'force-dynamic'
// export const runtime = 'edge'
// export const runtime = "nodejs";
import configOpenAPI from '@/server/lib/conf-openapi'
import createApp, { createRouter } from '@/server/lib/create-app'
// import { logger } from 'hono-pino'; // pnpm add hono-pino pino

import test from '@/server/routes/test/index'
import auth from '@/server/routes/auth/index'
import users from '@/server/routes/users/route'
// import users_get from '@/server/routes/users/get'
import user from '@/server/routes/user/route'
import groups from '@/server/routes/groups/route'
import follow from '@/server/routes/follow/route'

// const app = new Hono().basePath('/api/hono')
// const app = new OpenAPIHono().basePath('/api/hono')
const app = createApp()

// 使用 hono-pino 中间件进行日志记录
// app.use('*', logger());

const routes = [
  test,
  auth,
  users,
  // users_get,
  user,
  groups,
  follow,
] as const;

configOpenAPI(app)

routes.forEach(route => {
  app.route("/", route)
})

// const _app = app
//   .route("/", user)
//   .route("/", login)

// type PrintRoutesParams = typeof app;
// export function printRoutes(app: PrintRoutesParams) {
// export function printRoutes(app: OpenAPIHono<any, any, "*">) {
//   const routes = app.routes;
//   routes.forEach((route: any) => {
//     console.log(`${route.method.toUpperCase()} ${route.path}`);
//   });
// }
// console.log('Routes:');
// printRoutes(app);

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes[number];
// export type AppTypes = typeof _app;