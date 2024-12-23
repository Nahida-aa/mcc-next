// 'server-only';
import { createRouter } from "@/server/lib/create-app";

import * as route from './route'
import * as handler from './handler'

const router = createRouter()

import { AppRouteHandler } from "@/server/lib/types";
import { LoginRoute, RegisterRoute } from "./route";
import { db } from "@/lib/db";
import { createJWT, verifyToken } from "@/server/core/token";
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
import { Context } from "hono";

// router.openapi("/reg", handler.register)

router.openapi(route.register, async (c: Context) => {
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
})

// router.openapi(route.login, handler.login)




export default router