import { db } from "~/lib/db";
import { user_insertSchema, user_selectSchema } from "~/lib/schema/userBy";
import { createRouter } from "~/lib/create-app";
import jsonContent from "~/lib/openapi/helpers/json-content";
import { createRoute } from "@hono/zod-openapi";
import { hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { user as userTable, idCardInfo as idCardInfoTable, User} from "~/lib/db/schema/user"

const router = createRouter()
.openapi(createRoute({
  tags: ['user'],
  method: 'post', path: '/users',
  request: {
    body: jsonContent(
      user_insertSchema,
      'create user'
    )
  },
  responses: {
    [201]: jsonContent(
      user_selectSchema,
      'created user'
    )
  }
}), async (c) => {
  const inUser = c.req.valid("json")
  // 检查用户是否存在

  const { id_card_info: inIdCardInfo, ...userData  } = inUser;

  let hashPassword = null // 密码加密
  if (inUser.password){
    hashPassword = await hash(inUser.password, 10)
    userData.password = hashPassword
  }

  return await db.transaction(async (tx) => {
    // Insert user
    const [dbUser] = await tx.insert(userTable).values(userData).returning();

    let dbIdCardInfo = null;
    if (inIdCardInfo) {
      // Insert ID card info if provided
      [dbIdCardInfo] = await tx.insert(idCardInfoTable).values({
        ...inIdCardInfo,
        user_id: dbUser.id
      }).returning();
    }

    // Fetch the complete user data including ID card info
    const [completeUser] = await tx.select()
      .from(userTable)
      .leftJoin(idCardInfoTable, eq(userTable.id, idCardInfoTable.user_id))
      .where(eq(userTable.id, dbUser.id));

    return c.json({
      ...completeUser.User,
      id_card_info: completeUser.IDCardInfo
    }, 201);
  });
})

export default router