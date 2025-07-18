import { auth, AuthType, AuthTypeNotNull } from '@/lib/auth';
import { createMiddleware } from 'hono/factory'

export const authMiddleware = createMiddleware<{
  Variables: {
    session: AuthTypeNotNull
  }
}>(async (c, next) => {
  const session = await auth.api.getSession(c.req.raw);
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  c.set('session', session);
  console.log('Auth session:', session);
  
  await next();
});