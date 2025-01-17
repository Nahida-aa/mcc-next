import { db } from "@/lib/db";
import httpStatus from "@/lib/http-status-codes"
import { user_selectSchema } from "@/lib/schema/userBy";
import { createRouter } from "@/lib/create-app";
import jsonContent from "@/lib/openapi/helpers/json-content";
import { createRoute, z } from "@hono/zod-openapi";
import { notFoundSchema } from "@/lib/constans";
import IdUUIDParamsSchema from "@/lib/openapi/schemas/id-uuid-params";
import createErrorSchema from "@/lib/openapi/schemas/create-error-schema";
import NameParamsSchema from "@/lib/openapi/schemas/name-params";

const router = createRouter()

router.openapi(createRoute({
  tags: ['user'],
  path: '/users',
  method: 'get',
  responses: {
    [httpStatus.OK]: jsonContent(
      z.array(
        user_selectSchema
      ),
      'List of user'
    )
  }
}), async (c) => {
  const dbUsers = await db.query.user.findMany({
    with: {
      id_card_info: true, // 关联查询身份证信息
    }
  })
  return c.json(dbUsers, httpStatus.OK)
})

router.openapi(createRoute({
  tags: ['user'],
  path: '/users/{id}',
  method: 'get',
  request: {
    params: IdUUIDParamsSchema
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      user_selectSchema,
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
}), async (c) => {
  const { id } = c.req.valid("param")
  const dbUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, id),
    with: {
      id_card_info: true, // 关联查询身份证信息
    }
  });
  if (!dbUser) {
    return c.json({ message: 'User not found' }, httpStatus.NOT_FOUND)
  }
  return c.json(dbUser, httpStatus.OK)
})

router.openapi(createRoute({
  tags: ['user'],
  path: '/users/name/{name}',
  method: 'get',
  request: {
    params: NameParamsSchema
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      user_selectSchema,
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
}), async (c) => {
  const { name } = c.req.valid("param")
  const dbUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.name, name),
    with: {
      id_card_info: true, // 关联查询身份证信息
    }
  });
  if (!dbUser) {
    return c.json({ message: `User not found: ${name}` }, httpStatus.NOT_FOUND)
  }
  return c.json(dbUser, httpStatus.OK)
})

export default router