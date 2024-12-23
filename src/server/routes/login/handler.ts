import { AppRouteHandler } from "@/server/lib/types";
import { LoginRoute, RegisterRoute } from "./route";
import { db } from "@/lib/db";
import { createJWT, verifyJWT } from "@/server/core/token";
import { user as userTable, idCardInfo as idCardInfoTable, User, userInsertSchema, userSelectSchema, userPatchSchema} from "@/lib/db/schema/user"
import { eq } from "drizzle-orm";
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { compare } from 'bcrypt-ts';
import settings from "@/server/settings";
import * as httpStatus from "@/server/lib/http-status-codes"
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const inUser = c.req.valid("json")
  const { idCardInfo: inIdCardInfo, ...userData } = inUser;

  const salt = genSaltSync(10);
  const hashPassword = hashSync(userData.password, salt);
  userData.password = hashPassword;

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

    return c.json({
      ...dbUser,
      idCardInfo: dbIdCardInfo
    }, httpStatus.OK);
  })
}

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  console.log(`src/server/routes/login/handler.ts::login: `)
  const { name, password } = c.req.valid("json");
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.name, name),
  });
  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }
  const passwordsMatch = await compare(password, user.password!);
  if (!passwordsMatch) {
    return c.json({message: "用户名或密码错误"}, 401);
  }
  const sessionToken = await createJWT(
    {id: user.id, name: user.name, email: user.email, image: user.image, nickname: user.nickname}
    , settings.SESSION_TOKEN_EXPIRE_MINUTES * 60);
  setCookie(c, 'sessionToken', sessionToken, {
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + settings.SESSION_TOKEN_EXPIRE_MINUTES * 60 * 1000)
  });
  return c.json({ sessionToken,  tokenType: "Bearer" }, 200);
}