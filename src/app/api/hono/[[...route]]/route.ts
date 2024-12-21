import { Hono } from 'hono'
import { handle } from 'hono/vercel'
export const dynamic = 'force-dynamic'
// export const runtime = 'edge'
// export const runtime = "nodejs";
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import configOpenAPI from '@/server/lib/conf-openapi'
import createApp, { createRouter } from '@/server/lib/create-app'
// import { logger } from 'hono-pino'; // pnpm add hono-pino pino

import index from '@/server/routes/index'
import user from '@/server/routes/user'
import jsonContent from '@/server/openapi/helpers/json-content'
import createMessageObjectSchema from '@/server/openapi/schemas/create-message-object'

// const app = new Hono().basePath('/api/hono')
// const app = new OpenAPIHono().basePath('/api/hono')
const app = createApp()

// 使用 hono-pino 中间件进行日志记录
// app.use('*', logger());


const routes = [
  index,
  user,
]
routes.forEach(route => {
  app.route("", route)
})

configOpenAPI(app)

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono on Vercel!'
  })
})


app.get('/:wild', (c) => {
  const wild = c.req.param('wild')
  return c.json({
    message: `Hello from Hono on Vercel! You're now on /api/${wild}!`
  })
})

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
// export const PATCH = handle(app);
// export const DELETE = handle(app);