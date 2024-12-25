import httpStatus from "@/server/lib/http-status-codes"
import { db } from "@/server/db";
import { user_insertSchema, user_patchSchema, user_selectSchema } from "@/server/lib/schema/userBy";
import { createRouter } from "@/server/lib/create-app";
import jsonContent from "@/server/openapi/helpers/json-content";
import { createRoute, z } from "@hono/zod-openapi";
import { hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { user as userTable, idCardInfo as idCardInfoTable, User} from "@/server/db/schema/user"
import IdUUIDParamsSchema from "@/server/openapi/schemas/id-uuid-params";
import { notFoundSchema } from "@/server/lib/constans";
import jsonContentOneOf from "@/server/openapi/helpers/json-content-one-of";
import createErrorSchema from "@/server/openapi/schemas/create-error-schema";
import createMessageObjectSchema from "@/server/openapi/schemas/create-message-object";
import NameParamsSchema from "@/server/openapi/schemas/name-params";
import exp from "constants";

const userPatchApiSchema = z.object({
  inUser: user_patchSchema,
  csrfToken: z.string().optional().openapi({ example: 'csrfToken' }),
})

const router = createRouter()

.openapi(createRoute({
  tags: ['user'],
  path: '/users/{id}',
  method: 'patch',
  security: [{ OAuth2PasswordBearer: [] }],
  request: {
    params: IdUUIDParamsSchema,
    headers: z.object({
      Authorization: z.string().nullable().openapi({ example: 'Bearer session_token' }),
      // Cookie: z.string().nullable().openapi({ example: 'sessionToken=sessionToken;csrfToken=csrfToken' }),
    }),
    cookies: z.object({
      sessionToken: z.string().nullable().openapi({ example: 'session_token' }),
      csrfToken: z.string().nullable().openapi({ example: 'csrf_token'}),
    }),
    body: jsonContent(
      userPatchApiSchema,
      'update user'
    )
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      user_selectSchema,
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
}), async (c) => {
  const { id } = c.req.valid("param")
  const {inUser, csrfToken} = c.req.valid("json")
  const { idCardInfo: inIdCardInfo, ...userData } = inUser;
  let hashPassword = null // 密码加密
  if (inUser.password){
    hashPassword = await hash(inUser.password, 10)
    userData.password = hashPassword
  }
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
        where: eq(idCardInfoTable.user_id, id)
      });

      if (existingIdCardInfo) {
        // Update existing idCardInfo
        [updatedIdCardInfo] = await tx.update(idCardInfoTable)
          .set(inIdCardInfo)
          .where(eq(idCardInfoTable.user_id, id))
          .returning();
      } else {
        // Insert new idCardInfo
        [updatedIdCardInfo] = await tx.insert(idCardInfoTable)
          .values({ ...inIdCardInfo, user_id: id })
          .returning();
      }
    }

    // Fetch the complete updated user data including ID card info
    // const [completeUser] = await tx.select()
    //   .from(userTable)
    //   .leftJoin(idCardInfoTable, eq(userTable.id, idCardInfoTable.user_id))
    //   .where(eq(userTable.id, id));

    return c.json({
      // ...completeUser.User,
      // idCardInfo: completeUser.IDCardInfo
      ...updatedUser,
      idCardInfo: updatedIdCardInfo
    }, httpStatus.OK);
  });
})

.openapi(createRoute({
  tags: ['user'],
  path: '/users/name/{name}',
  method: 'patch',
  request: {
    params: NameParamsSchema,
    body: jsonContent(
      user_patchSchema,
      'update user'
    )
  },
  responses: {
    [httpStatus.OK]: jsonContent(
      user_selectSchema,
      'updated user'
    ),
    [httpStatus.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found; 用户未找到'
    ),
    [httpStatus.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(user_patchSchema), createErrorSchema(NameParamsSchema), ],
      'The validation error(s); 验证错误'
    ),
  }
}), async (c) => {
  const { name } = c.req.valid("param")
  const inUser = c.req.valid("json")
  const { idCardInfo: inIdCardInfo, ...userData } = inUser;
  let hashPassword = null // 密码加密
  if (inUser.password){
    hashPassword = await hash(inUser.password, 10)
    userData.password = hashPassword
  }
  return await db.transaction(async (tx) => {
    // Update user
    const [updatedUser] = await tx.update(userTable)
      .set(userData)
      .where(eq(userTable.name, name))
      .returning();

    if (!updatedUser) {
      return c.json({ message: 'User not found' }, httpStatus.NOT_FOUND);
    }

    let updatedIdCardInfo = null;
    if (inIdCardInfo) {
      // Check if idCardInfo exists
      const existingIdCardInfo = await tx.query.idCardInfo.findFirst({
        where: eq(idCardInfoTable.user_id, updatedUser.id)
      });

      if (existingIdCardInfo) {
        // Update existing idCardInfo
        [updatedIdCardInfo] = await tx.update(idCardInfoTable)
          .set(inIdCardInfo)
          .where(eq(idCardInfoTable.user_id, updatedUser.id))
          .returning();
      } else {
        // Insert new idCardInfo
        [updatedIdCardInfo] = await tx.insert(idCardInfoTable)
          .values({ ...inIdCardInfo, user_id: updatedUser.id })
          .returning();
      }
    }

    return c.json({
      ...updatedUser,
      idCardInfo: updatedIdCardInfo
    }, httpStatus.OK);
  });
})

export default router