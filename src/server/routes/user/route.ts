import { userInsertSchema, userPatchSchema, userSelectSchema } from "@/lib/db/schema/user";
import jsonContent from "@/server/openapi/helpers/json-content";
import { createRoute, z } from "@hono/zod-openapi";
import * as httpStatus from "@/server/lib/http-status-codes"
import IdUUIDParamsSchema from "@/server/openapi/schemas/id-uuid-params";
import { notFoundSchema } from "@/server/lib/constans";
import createErrorSchema from "@/server/openapi/schemas/create-error-schema";
import NameParamsSchema from "@/server/openapi/schemas/name-params";
import jsonContentOneOf from "@/server/openapi/helpers/json-content-one-of";
import createMessageObjectSchema from "@/server/openapi/schemas/create-message-object";
import { Cookie } from "next/font/google";

export const list = createRoute({
  tags: ['user'],
  path: '/users',
  method: 'get',
  responses: {
    [httpStatus.OK]: jsonContent(
      z.array(
        userSelectSchema
      ),
      'List of user'
    )
  }
})

export const getOne = createRoute({
  tags: ['user'],
  path: '/users/{id}',
  method: 'get',
  request: {
    params: IdUUIDParamsSchema
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      userSelectSchema,
      'get user'
    ),
    [httpStatus.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found; 用户未找到'
    ),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema), 
      'The validation error(s); 验证错误'
    ),
  }
})

export const getOneByName = createRoute({
  tags: ['user'],
  path: '/users/name/{name}',
  method: 'get',
  request: {
    params: NameParamsSchema
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      userSelectSchema,
      'get user'
    ),
    [httpStatus.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found; 用户未找到'
    ),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(NameParamsSchema), 
      'The validation error(s); 验证错误'
    ),
  }
})

export const create = createRoute({
  tags: ['user'],
  path: '/users',
  method: 'post',
  request: {
    body: jsonContent(
      userInsertSchema,
      'create user'
    )
  },
  responses: {
    [200]: jsonContent(
      userSelectSchema
      ,
      'created user'
    )
  }
})
const userPatchApiSchema = z.object({
  inUser: userPatchSchema,
  csrfToken: z.string().optional().openapi({ example: 'csrfToken' }),
})
export const patch = createRoute({
  tags: ['user'],
  path: '/users/{id}',
  method: 'patch',
  security: [{ OAuth2PasswordBearer: [] }],
  summary: '更新用户数据',
  request: {
    params: IdUUIDParamsSchema,
    headers: z.object({
      Authorization: z.string().nullable().openapi({ example: 'Bearer sessionToken' }),
      // Cookie: z.string().nullable().openapi({ example: 'sessionToken=sessionToken;csrfToken=csrfToken' }),
    }),
    cookies: z.object({
      sessionToken: z.string().nullable().openapi({ example: 'sessionToken' }),
      csrfToken: z.string().nullable().openapi({ example: 'csrfToken'}),
    }),
    body: jsonContent(
      userPatchApiSchema,
      'update user'
    )
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      userSelectSchema,
      'updated user'
    ),
    [httpStatus.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found; 用户未找到'
    ),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(userPatchApiSchema), createErrorSchema(IdUUIDParamsSchema), ],
      'The validation error(s); 验证错误'
    ),
    [httpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema('Authentication required'),
      'Authentication required; 未授权'
    ),
  }
})

export const patchByName = createRoute({
  tags: ['user'],
  path: '/users/name/{name}',
  method: 'patch',
  request: {
    params: NameParamsSchema,
    body: jsonContent(
      userPatchSchema,
      'update user'
    )
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      userSelectSchema,
      'updated user'
    ),
    [httpStatus.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found; 用户未找到'
    ),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(userPatchSchema), createErrorSchema(NameParamsSchema), ],
      'The validation error(s); 验证错误'
    ),
  }
})

export const remove = createRoute({
  tags: ['user'],
  path: '/users/{id}',
  method: 'delete',
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    // [httpStatus.OK]: jsonContent(
    //   userSelectSchema,
    //   'deleted user'
    // ),
    [httpStatus.NO_CONTENT]: {
      description: 'deleted user',
    },
    [httpStatus.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found; 用户未找到'
    ),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      'The validation error(s); 验证错误'
    ),
  }
})

export type ListRoute = typeof list
export type GetOneRoute = typeof getOne
export type GetOneByNameRoute = typeof getOneByName
export type CreateRoute = typeof create
export type PatchRoute = typeof patch
export type PatchByNameRoute = typeof patchByName
export type RemoveRoute = typeof remove