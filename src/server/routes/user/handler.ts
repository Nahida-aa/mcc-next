import * as httpStatus from "@/server/lib/http-status-codes"
import type { CreateRoute, GetOneByNameRoute, GetOneRoute, ListRoute, PatchByNameRoute, PatchRoute, RemoveRoute } from "./route";
import { db } from "@/lib/db";
import { AppRouteHandler } from "@/server/lib/types";
import { user as userTable, idCardInfo as idCardInfoTable, User, userInsertSchema, userSelectSchema, userPatchSchema} from "@/lib/db/schema/user"
import { eq } from "drizzle-orm";
import { hash, hashSync } from "bcrypt-ts";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  console.log(`src/server/routes/user.ts::router.openapi::createRoute: `)
  const dbUsers = await db.query.user.findMany({
    with: {
      idCardInfo: true, // 关联查询身份证信息
    }
  });
  console.log(`src/server/routes/user.ts::router.openapi::createRoute: dbUsers: ${JSON.stringify(dbUsers)}`)
  return c.json(dbUsers, httpStatus.OK)
}

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
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
}

export const getOneByName: AppRouteHandler<GetOneByNameRoute> = async (c) => {
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
}

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const inUser = c.req.valid("json")
  // 检查用户是否存在

  const { idCardInfo: inIdCardInfo, ...userData  } = inUser;

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
}

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
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
}

export const patchByName: AppRouteHandler<PatchByNameRoute> = async (c) => {
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
        where: eq(idCardInfoTable.userId, updatedUser.id)
      });

      if (existingIdCardInfo) {
        // Update existing idCardInfo
        [updatedIdCardInfo] = await tx.update(idCardInfoTable)
          .set(inIdCardInfo)
          .where(eq(idCardInfoTable.userId, updatedUser.id))
          .returning();
      } else {
        // Insert new idCardInfo
        [updatedIdCardInfo] = await tx.insert(idCardInfoTable)
          .values({ ...inIdCardInfo, userId: updatedUser.id })
          .returning();
      }
    }

    return c.json({
      ...updatedUser,
      idCardInfo: updatedIdCardInfo
    }, httpStatus.OK);
  });
}

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
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
}