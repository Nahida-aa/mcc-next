'server-only';
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import jsonContent from "../openapi/helpers/json-content";
import createMessageObjectSchema from "../openapi/schemas/create-message-object";
import * as httpStatus from "@/server/lib/http-status-codes"
import { user as userTable, idCardInfo as idCardInfoTable, User, userInsertSchema, userSelectSchema, idCardInfo, idCardInfoInsertSchema} from "@/lib/db/schema/user"
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import createErrorSchema from "../openapi/schemas/create-error-schema";

// const router = new OpenAPIHono().basePath('/api/hono')
const router = createRouter()

const registerUserSchema = userInsertSchema.omit({description: true, nickname: true, email: true, gender: true, age: true}).extend({idCardInfo: idCardInfoInsertSchema.omit({frontImageUrl: true, backImageUrl: true})})

router.openapi(createRoute({
  tags: ['user'],
  path: '/users/register',
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
}), async (c) => {
  console.log(`src/server/routes/user.ts::router.openapi::createRoute: `)
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
    }, httpStatus.OK);
  });
})

export default router