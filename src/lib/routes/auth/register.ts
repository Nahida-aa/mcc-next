import { createRouter } from "@/lib/create-app"
import jsonContent from "@/lib/openapi/helpers/json-content";
import { createRoute, z } from "@hono/zod-openapi";
import httpStatus from "@/lib/http-status-codes"
import createErrorSchema from "@/lib/openapi/schemas/create-error-schema";
import { not } from "drizzle-orm";
import { notFoundSchema } from "@/lib/constans";
import createMessageObjectSchema from "@/lib/openapi/schemas/create-message-object";
import { createInsertSchema } from "drizzle-zod";
import { db } from "@/lib/db";
import { createJWT, verifyJWT } from "@/lib/core/token";
import { idCardInfo_insertSchema, platformInfo_schema, } from "@/lib/schema/userBy"
import {user as userTable, idCardInfo as idCardInfoTable, User, idCardInfo, } from "@/lib/db/schema/user"
import { eq } from "drizzle-orm";
import { genSaltSync, hash, hashSync } from 'bcrypt-ts';
import { compare } from 'bcrypt-ts';
import settings from "@/lib/settings";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'
import jsonContentOneOf from "@/lib/openapi/helpers/json-content-one-of";
import { create_sessionToken_and_setCookie } from "@/lib/middleware/utils";

export const register_user_schema = z.object({
  name: z.string().min(1).max(32),
  password: z.string().min(6).max(64),
  phone: z.string().min(1).max(64),
  image: z.string().optional(),
  platform_info: platformInfo_schema.nullable().optional(),
  id_card_info: idCardInfo_insertSchema.omit({front_image_url: true, back_image_url: true})
});

export const session_token_schema = z.object({
  session_token: z.string(),
  token_type: z.string()
})

const router = createRouter()
.openapi(createRoute({
  tags: ['auth'],
  path: '/auth/register',
  method: 'post',
  request: {
    body: jsonContent(register_user_schema,'create user')
  },
  responses: {
    [httpStatus.CREATED]: jsonContent(session_token_schema, '成功'),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(register_user_schema), 
      'The validation error(s); 验证错误'
    ),
    [httpStatus.CONFLICT]: jsonContent(createMessageObjectSchema('用户名或手机号或身份证号已存在'), '用户名或手机号或身份证号已存在')
  }
}), async (c) => {
  const  body_json = c.req.valid("json")
  const { id_card_info: id_card_info_data, ...user_data } = body_json;
  // 避免重复注册的检查
  const existing_user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.name, user_data.name) || eq(user.phone, user_data.phone),
  });
  if (existing_user) {
    return c.json({ message: '用户名或手机号已存在' }, httpStatus.CONFLICT);
  }
  const existing_id_card = await db.query.idCardInfo.findFirst({
    where: (idCardInfo, { eq }) => eq(idCardInfo.id_card_number, id_card_info_data.id_card_number),
  });
  if (existing_id_card) {
    return c.json({ message: '身份证号已存在' }, httpStatus.CONFLICT);
  }

  // 检查是否提供 image, 如果没有提供, 使用默认的
  if (!user_data.image) {
    user_data.image = `https://avatar.vercel.sh/${user_data.name}` as string
    // user_data.image as string
  }
  // user_data.image as string

  const hash_password = await hash(user_data.password, 10);
  user_data.password = hash_password;

  const db_user = await db.transaction(async (tx) => {
    const [db_user] = await tx.insert(userTable).values(user_data).returning();
    if (id_card_info_data) {
      await tx.insert(idCardInfoTable).values({
        ...id_card_info_data,
        user_id: db_user.id
      })
    }
    return db_user;
  })

  const session_token = await create_sessionToken_and_setCookie(c, db_user)
  const res = { session_token, token_type: "Bearer" }
  return c.json(res, httpStatus.CREATED);
})

const signUp_schema = z.object({
  name: z.string().min(1).max(32),
  password: z.string().min(6).max(64),
});
router.openapi(createRoute({
  tags: ['auth'],
  method: 'post', path: '/auth/sign-up',
  request: {
    body: jsonContent(signUp_schema,'create user')
  },
  responses: {
    [httpStatus.CREATED]: jsonContent(session_token_schema, '成功'),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(register_user_schema), 
      'The validation error(s); 验证错误'
    ),
    [httpStatus.CONFLICT]: jsonContent(createMessageObjectSchema('用户名或手机号或身份证号已存在'), '用户名或手机号或身份证号已存在')
  }
}), async (c) => {
  const  body_json = c.req.valid("json")
  const {...user_data } = body_json;
  // 避免重复注册的检查
  const existing_user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.name, user_data.name),
  });
  if (existing_user) {
    return c.json({ message: '用户名或手机号已存在' }, httpStatus.CONFLICT);
  }

  const user_data_image = `https://avatar.vercel.sh/${user_data.name}` as string

  const hash_password = await hash(user_data.password, 10);
  user_data.password = hash_password;

  const db_user = await db.transaction(async (tx) => {
    const [db_user] = await tx.insert(userTable).values({
      ...user_data,
      image: user_data_image,
    }).returning();
    return db_user;
  })

  const session_token = await create_sessionToken_and_setCookie(c, db_user)
  const res = { session_token, token_type: "Bearer" }
  return c.json(res, httpStatus.CREATED);
})

export default router