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
import { createCSRFToken } from '@/server/core/token'
import { user_meta_schema } from '@/server/lib/schema/user';

export const auth_session_out_schema = z.object({
  user: user_meta_schema.optional().nullable(),
  scopes: z.array(z.string()).optional().nullable()
}).nullable()

const router = createRouter()
.openapi(createRoute({
  tags: ['auth'],
  path: '/auth/session',
  method: 'get',
  description: `如果 cookie 中有 sessionToken, 则返回 { user, ...}, 否则返回 null, 注意次api只会响应 200, 这是特意这样设计的, 如果有异议请告诉我`,
  request: {
    cookies: z.object({
      sessionToken: z.string().optional()
    })
  },
  responses: {
    [200]: jsonContent(auth_session_out_schema,
      '已响应 session'
    ),
  }
}), async (c) => {
  const sessionToken = getCookie(c, 'session_token')
  if (!sessionToken) {
    return c.json(null, 200)
  }
  const JWTPayload = await verifyJWT(sessionToken)
  console.log('JWTPayload', JWTPayload)
  return c.json({
    user: JWTPayload.user,
    scopes: JWTPayload.scopes
  }, 200)
})

export default router