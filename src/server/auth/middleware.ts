import { auth, AuthType, AuthTypeNotNull } from '@/lib/auth';
import { AppEnv } from '@/server/types';
import { createMiddleware } from 'hono/factory'

export const requiredAuthMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession(c.req.raw);
  if (!session) return c.json({ message: 'unauthenticated: 未经身份认证' }, 401);
  
  c.set('session', session);
  // console.log('Auth session:', session);
  
  await next();
});

export const optionalAuthMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession(c.req.raw);
  if (session) {
    c.set('session', session);
  }
  // console.log('Optional Auth session:', session);
  await next();
});

export const adminAuthMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession(c.req.raw);
  if (!session) return c.json({ message: 'unauthenticated: 未经身份认证' }, 401);
  if (c.var.session.user.role !== 'admin') return c.json({ message: 'unauthorized: 无权访问' }, 403);
  c.set('session', session);
  // console.log('Auth session:', session);
  await next();
});