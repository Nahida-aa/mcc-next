import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "@/server/lib/create-app";
import jsonContent from "@/server/openapi/helpers/json-content";
import { db } from "@/lib/db";
import { user as userTable, idCardInfo as idCardInfoTable, User, userInsertSchema, userSelectSchema, userPatchSchema} from "@/lib/db/schema/user"
import { eq } from "drizzle-orm";
import IdUUIDParamsSchema from "@/server/openapi/schemas/id-uuid-params";
import * as httpStatus from "@/server/lib/http-status-codes"
import createErrorSchema from "@/server/openapi/schemas/create-error-schema";
import jsonContentOneOf from "@/server/openapi/helpers/json-content-one-of";
import NameParamsSchema from "@/server/openapi/schemas/name-params";
import { Description } from "@radix-ui/react-dialog";
import { notFound } from "next/navigation";
import { notFoundSchema } from "@/server/lib/constans";

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
}), async (c) => {
  const { name } = c.req.valid("param")
  const dbUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.name, name),
    with: {
      idCardInfo: true, // 关联查询身份证信息
    }
  });
  if (!dbUser) {
    return c.json({ message: `User not found: ${name}` }, httpStatus.NOT_FOUND)
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
      'created user'
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

router.openapi(createRoute({
  tags: ['user'],
  path: '/users/{id}',
  method: 'patch',
  request: {
    params: IdUUIDParamsSchema,
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
      [createErrorSchema(userPatchSchema), createErrorSchema(IdUUIDParamsSchema), ],
      'The validation error(s); 验证错误'
    ),
  }
}), async (c) => {
  const { id } = c.req.valid("param")
  const inUser = c.req.valid("json")
  const { idCardInfo: inIdCardInfo, ...userData } = inUser;
  return await db.transaction(async (tx) => {
    // Update user
    const [updatedUser] = await tx.update(userTable)
      .set(userData)
      .where(eq(userTable.id, id))
      .returning();

    if (!updatedUser) {
      return c.json({ message: 'User not found' }, httpStatus.NOT_FOUND);
    }

    let updatedIdCardInfo = null;
    if (inIdCardInfo) {
      // Check if idCardInfo exists
      const existingIdCardInfo = await tx.query.idCardInfo.findFirst({
        where: eq(idCardInfoTable.userId, id)
      });

      if (existingIdCardInfo) {
        // Update existing idCardInfo
        [updatedIdCardInfo] = await tx.update(idCardInfoTable)
          .set(inIdCardInfo)
          .where(eq(idCardInfoTable.userId, id))
          .returning();
      } else {
        // Insert new idCardInfo
        [updatedIdCardInfo] = await tx.insert(idCardInfoTable)
          .values({ ...inIdCardInfo, userId: id })
          .returning();
      }
    }

    // Fetch the complete updated user data including ID card info
    // const [completeUser] = await tx.select()
    //   .from(userTable)
    //   .leftJoin(idCardInfoTable, eq(userTable.id, idCardInfoTable.userId))
    //   .where(eq(userTable.id, id));

    return c.json({
      // ...completeUser.User,
      // idCardInfo: completeUser.IDCardInfo
      ...updatedUser,
      idCardInfo: updatedIdCardInfo
    }, httpStatus.OK);
  });
})

router.openapi(createRoute({
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
}), async (c) => {
  const { id } = c.req.valid("param")
  return await db.transaction(async (tx) => {
    // First, delete the user's ID card info
    await tx.delete(idCardInfoTable)
      .where(eq(idCardInfoTable.userId, id))

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