import jsonContent from "@/server/openapi/helpers/json-content";
import { createRoute, z } from "@hono/zod-openapi";
import httpStatus from "@/server/lib/http-status-codes"
import createErrorSchema from "@/server/openapi/schemas/create-error-schema";
import { not } from "drizzle-orm";
import { notFoundSchema } from "@/server/lib/constans";
import createMessageObjectSchema from "@/server/openapi/schemas/create-message-object";
import { idCardInfo_insertSchema, } from "@/server/lib/schema/userBy"
import {user as userTable, idCardInfo as idCardInfoTable, User, idCardInfo, } from "@/server/db/schema/user"
import { createInsertSchema } from "drizzle-zod";

import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { compare, hash, hashSync } from "bcrypt-ts";

import { createRouter } from "@/server/lib/create-app";
import { createJWT } from "@/server/core/token";
import settings from "@/server/settings";
import { create_sessionToken_and_setCookie } from "@/server/middleware/utils";
import { session_token_schema } from "./register";

export const login_schema = z.object({
  name: z.string().min(1),
  password: z.string().min(6),
});

const router = createRouter()
.openapi(createRoute({
  tags: ['auth'],
  path: '/auth/login',
  method: 'post',
  request: {
    body: jsonContent(
      login_schema,
      'login'
    )
  },
  responses: {
    [httpStatus.OK]: jsonContent(session_token_schema,
      '登录成功，响应头中会自动设置 sessionToken 到 Cookie 中',
    ),
    [httpStatus.NOT_FOUND]: jsonContent(
      notFoundSchema, "用户未找到"
    ),
    [httpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("用户名或密码错误"),
      "用户名或密码错误"
    ),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(login_schema),
      'The validation error(s); 类型验证错误'
    ),
  }
}), async (c) => {
  const { name, password } = c.req.valid("json");
  const db_user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.name, name),
  });
  if (!db_user) {
    return c.json({ message: 'User not found' }, 404);
  }
  const passwords_match = await compare(password, db_user.password!);
  if (!passwords_match) {
    return c.json({message: "用户名或密码错误"}, 401);
  }
  const session_token = await create_sessionToken_and_setCookie(c, db_user)
  return c.json({ session_token,  token_type: "Bearer" }, 200);
})



export default router