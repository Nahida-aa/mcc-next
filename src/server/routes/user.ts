import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import jsonContent from "../openapi/helpers/json-content";
import { db } from "@/lib/db";
import { user as userTable, idCardInfo as idCardInfoTable, User, userInsertSchema, userSelectSchema} from "@/lib/db/schema/user"
import { eq } from "drizzle-orm";
import IdUUIDParamsSchema from "../openapi/schemas/id-uuid-params";
import * as httpStatus from "@/server/lib/http-status-codes"
import createErrorSchema from "../openapi/schemas/create-error-schema";

const router = createRouter()

router.openapi(createRoute({
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
}), async (c) => {
  console.log(`src/server/routes/user.ts::router.openapi::createRoute: `)
  const dbUsers = await db.query.user.findMany({
    with: {
      idCardInfo: true, // 关联查询身份证信息
    }
  });
  console.log(`src/server/routes/user.ts::router.openapi::createRoute: dbUsers: ${JSON.stringify(dbUsers)}`)
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
      userSelectSchema,
      'get user'
    ),
    [httpStatus.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string()
      }),
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
      idCardInfo: true, // 关联查询身份证信息
    }
  });
  if (!dbUser) {
    return c.json({ message: 'User not found' }, httpStatus.NOT_FOUND)
  }
  return c.json(dbUser, httpStatus.OK)
})

router.openapi(createRoute({
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
      'create user'
    )
  }
}), async (c) => {
  const inUser = c.req.valid("json")
  const { idCardInfo: inIdCardInfo, ...userData } = inUser;

  return await db.transaction(async (tx) => {
    // Insert user
    const [dbUser] = await tx.insert(userTable).values(userData).returning();

    let dbIdCardInfo = null;
    if (inIdCardInfo) {
      // Insert ID card info if provided
      [dbIdCardInfo] = await tx.insert(idCardInfoTable).values({
        ...inIdCardInfo,
        userId: dbUser.id
      }).returning();
    }

    // Fetch the complete user data including ID card info
    const [completeUser] = await tx.select()
      .from(userTable)
      .leftJoin(idCardInfoTable, eq(userTable.id, idCardInfoTable.userId))
      .where(eq(userTable.id, dbUser.id));

    return c.json({
      ...completeUser.User,
      idCardInfo: completeUser.IDCardInfo
    });
  });
})

export default router