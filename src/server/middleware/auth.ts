import { Context, Next } from 'hono'
// import { Context, Next } from "@hono/zod-openapi";
import { getCookie } from 'hono/cookie'
import { verifyJWT } from '@/server/core/token'

export async function getSessionTokenPayload(c: Context) {
  const authHeader = c.req.header('Authorization')
  let token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    token = getCookie(c, 'sessionToken')
  }

  if (!token) {
    return null
  }

  return verifyJWT(token)
}

export async function getSessionTokenPayloadDep(c: Context) {
  try {
    const payload = await getSessionTokenPayload(c)
    if (!payload) {
      return c.json({ message: 'Authentication required' }, 401)
    }
    return payload
  } catch (error) {
    return c.json({ message: 'token verification failed' }, 401)
  }
}

export async function getSessionTokenPayloadMiddleware(c: Context, next: Next) {
  const payload = await getSessionTokenPayloadDep(c)
  c.set('sessionTokenPayload', payload)
  await next()
}

