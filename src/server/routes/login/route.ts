import jsonContent from "@/server/openapi/helpers/json-content";
import { createRoute, z } from "@hono/zod-openapi";
import * as httpStatus from "@/server/lib/http-status-codes"
import createErrorSchema from "@/server/openapi/schemas/create-error-schema";
import { not } from "drizzle-orm";
import { notFoundSchema } from "@/server/lib/constans";
import createMessageObjectSchema from "@/server/openapi/schemas/create-message-object";
import { user as userTable, idCardInfo as idCardInfoTable, User, userInsertSchema, userSelectSchema, idCardInfo, idCardInfoInsertSchema, platformInfoSchema} from "@/lib/db/schema/user"
import { createInsertSchema } from "drizzle-zod";


export const registerUserSchema = createInsertSchema(userTable,
  {
    name: schema => schema.min(1),
    password: schema => schema.min(6),
    phone: schema => schema.min(1),
  })
  .omit({id: true, createdAt: true, updatedAt: true, lastLogin: true, 
    followersCount: true, followingCount: true, 
    isSuperuser: true, isStaff: true, isActive: true, description: true, nickname: true, email: true, gender: true, age: true})
  .extend({
    password: z.string().min(6),
    platformInfo: platformInfoSchema.nullable(),
    idCardInfo: idCardInfoInsertSchema.omit({frontImageUrl: true, backImageUrl: true})
  })

export const register = createRoute({
  tags: ['login'],
  path: '/register',
  method: 'post',
  request: {
    body: jsonContent(
      registerUserSchema,
      'create user'
    )
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      userSelectSchema,
      'create user'
    ),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(registerUserSchema), 
      'The validation error(s); 验证错误'
    ),
  }
})

const loginSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(6),
});
export const login = createRoute({
  tags: ['login'],
  path: '/login',
  method: 'post',
  request: {
    body: jsonContent(
      loginSchema,
      'login'
    )
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      z.object({
        sessionToken: z.string(),
        tokenType: z.string().openapi({example: 'Bearer'}),
      }),
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
      createErrorSchema(loginSchema),
      'The validation error(s); 类型验证错误'
    ),
  }
})

const loginUseNameOrEmailOrPhoneSchema = z.object({
  nameOrEmailOrPhone: z.string().min(1),
  password: z.string().min(6),
});
export const loginUseNameOrEmailOrPhone = createRoute({
  tags: ['login'],
  path: '/login-or',
  method: 'post',
  request: {
    body: jsonContent(
      loginUseNameOrEmailOrPhoneSchema,
      'loginUseNameOrEmailOrPhone'
    )
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      z.object({
        sessionToken: z.string(),
        tokenType: z.string().openapi({example: 'Bearer'}),
      }),
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
      createErrorSchema(loginUseNameOrEmailOrPhoneSchema),
      'The validation error(s); 类型验证错误'
    ),
  }
})

export const login2token = createRoute({
  tags: ['login'],
  path: '/login2token',
  method: 'post',
  request: {
    body: jsonContent(
      loginSchema,
      'login'
    )
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        tokenType: z.string().openapi({example: 'Bearer'}),
      }),
      'login-ed'
    ),
    [httpStatus.NOT_FOUND]: jsonContent(
      notFoundSchema, "用户未找到"
    ),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginSchema),
      'The validation error(s); 类型验证错误'
    ),
  }
})

export type RegisterRoute = typeof register;
export type LoginRoute = typeof login;
export type LoginUseNameOrEmailOrPhoneRoute = typeof loginUseNameOrEmailOrPhone;