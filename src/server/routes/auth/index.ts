import { decode } from 'hono/jwt'
import { createRouter } from "@/server/lib/create-app";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import settings from "@/server/settings";
import { verifyJWT } from "@/server/core/token";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'
import jsonContent from '@/server/openapi/helpers/json-content';
import { createCSRFToken } from '@/server/core/token';

const router = createRouter()
.openapi(createRoute({
  tags: ['auth'],
  path: '/auth/csrf',
  method: 'get',
  summary: '获取 CSRF token',
  description: ` 用于在 需要csrfToken的请求前先获取 csrfToken, 会在两个header和body中返回 csrfToken, header中的是不可读的, body中的是可读的, 用于前端在请求体中携带csrfToken

  需要csrfToken的请求: 
  - /api/hono/auth/signin
  - /api/hono/auth/signout`,
  responses: {
    [200]: jsonContent(
      z.object({
        csrfToken: z.string()
      }),
      '已响应 CSRF token, 并将hash后的csrfToken放到 cookie 中'
    )
  }
}), async (c) => {
  const { csrfCookie, csrfToken } = await createCSRFToken()
  setCookie(c, 'csrfToken', csrfCookie, {
    httpOnly: true,
    sameSite: 'strict',
  })
  return c.json({
    csrfToken
  })
})
.openapi(createRoute({
  tags: ['auth'],
  path: '/auth/session',
  method: 'get',
  summary: '获取 session (从 cookie 中)',
  description: `如果 cookie 中有 sessionToken, 则返回 { user, ...}, 否则返回 null, 注意次api只会响应 200, 这是特意这样设计的, 如果有异议请告诉我`,
  request: {
    cookies: z.object({
      sessionToken: z.string().optional()
    })
  },
  responses: {
    [200]: jsonContent(
      z.object({
        user: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string().optional(),
          image: z.string().optional(),
          nickname: z.string().optional(),
        }).optional().nullable()
      }).nullable(),
      '已响应 session'
    ),

  }
}), async (c) => {
  const sessionToken = getCookie(c, 'sessionToken')
  if (!sessionToken) {
    return c.json(null, 200)
  }
  const JWTPayload = await verifyJWT(sessionToken)
  return c.json({
    user: {
      id: JWTPayload.id,
      email: JWTPayload.email,
      name: JWTPayload.name,
      image: JWTPayload.image,
      nickname: JWTPayload.nickname
    }
  }, 200)
})

export default router