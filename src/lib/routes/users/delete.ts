import httpStatus from "@/lib/http-status-codes"
import { db } from "@/lib/db";
import { createRouter } from "@/lib/create-app";
import jsonContent from "@/lib/openapi/helpers/json-content";
import createErrorSchema from "@/lib/openapi/schemas/create-error-schema";
import IdUUIDParamsSchema from "@/lib/openapi/schemas/id-uuid-params";
import { createRoute } from "@hono/zod-openapi";
import { notFoundSchema } from "@/lib/constans";
import { user as userTable, idCardInfo as idCardInfoTable, User} from "@/lib/db/schema/user"
import { eq } from "drizzle-orm";

const router = createRouter()

.openapi(createRoute({
  tags: ['user'],
  path: '/users/{id}',
  method: 'delete',
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    // [httpStatus.OK]: jsonContent(
    //   user_selectSchema,
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
}), async (c) => {
  const { id } = c.req.valid("param")
  return await db.transaction(async (tx) => {
    // First, delete the user's ID card info
    await tx.delete(idCardInfoTable)
      .where(eq(idCardInfoTable.user_id, id))

    // Then, delete the user
    const result = await tx.delete(userTable)
      .where(eq(userTable.id, id))

    if (result.length === 0) {
      return c.json({ message: 'User not found' }, httpStatus.NOT_FOUND);
    }

    return c.body(null, httpStatus.NO_CONTENT);
  });
})

export default router