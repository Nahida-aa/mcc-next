import { user } from "@/server/db/schema/user";
import { createJWT, verifyJWT } from "@/server/core/token";
import settings from "@/server/settings";
import { z } from "@hono/zod-openapi";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'
import { user_meta_schema } from "../lib/schema/user";

export const session_token_payload_schema = z.object({
  user: user_meta_schema,
  scopes: z.array(z.string()),
  exp: z.number()
})
export const create_sessionToken_and_setCookie = async (c: any, dbUser: any) => {
  const session_token = await createJWT(
    {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        image: dbUser.image,
        nickname: dbUser.nickname
      },
      scopes: []
    }, settings.SESSION_TOKEN_EXPIRE_MINUTES * 60);
  setCookie(c, 'session_token', session_token, {
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + settings.SESSION_TOKEN_EXPIRE_MINUTES * 60 * 1000)
  });
  return session_token
}