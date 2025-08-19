import { auth, AuthType, AuthTypeNotNull } from '@/lib/auth';
import { createMiddleware } from 'hono/factory'

export const requiredAuthMiddleware = createMiddleware<{
  Variables: {
    session: AuthTypeNotNull
  }
}>(async (c, next) => {
  const session = await auth.api.getSession(c.req.raw);
  if (!session) return c.json({ error: 'Unauthorized' }, 401);
  
  c.set('session', session);
  // console.log('Auth session:', session);
  
  await next();
});

export const optionalAuthMiddleware = createMiddleware<{
  Variables: {
    session?: AuthTypeNotNull | null
  }
}>(async (c, next) => {
  const session = await auth.api.getSession(c.req.raw);
  c.set('session', session);
  // console.log('Optional Auth session:', session);
  
  await next();
});