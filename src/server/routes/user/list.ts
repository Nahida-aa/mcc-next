import { db } from "@/server/db";
import { follow_table } from "@/server/db/schema/follow";
import { user as user_table } from "@/server/db/schema/user";
import { group as group_table } from "@/server/db/schema/group";
import { createRouter } from "@/server/lib/create-app";
import { offset_limit_query_schema } from "@/server/lib/schema/query";
import { get_current_user_and_res } from "@/server/middleware/auth";
import { createRoute } from "@hono/zod-openapi";
import { sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";


const router = createRouter()

router.openapi(createRoute({
  tags: ['user'],
  description: `列出所有用户\n- is_following: auth_user 是否关注 list中的, 某个用户\n- is_following_me: list中的用户是否关注 auth_user`,
  path: "/user",
  method: "get",
  request: {
    query: offset_limit_query_schema,
  },
  responses: {
    [200]: {description: "返回用户列表"},
    [401]: {description: "未登录"},
  }
}), async (c) => {
  const CU_ret = await get_current_user_and_res(c)
  if (!CU_ret.success) return c.json(CU_ret.json_body, CU_ret.status)
  const auth_user = CU_ret.user

  const { offset, limit } = c.req.valid("query")

  const users = await db.select({
    id: user_table.id,
    name: user_table.name,
    nickname: user_table.nickname,
    image: user_table.image,
    is_following: sql<boolean>`EXISTS (
      SELECT 1 FROM ${follow_table}
      WHERE ${follow_table.follower_id} = ${auth_user.id}
      AND ${follow_table.target_id} = ${user_table.id}
      AND ${follow_table.target_type} = 'user'
    )`.as('is_following'),
    is_following_me: sql<boolean>`EXISTS (
      SELECT 1 FROM ${follow_table}
      WHERE ${follow_table.follower_id} = ${user_table.id}
      AND ${follow_table.target_id} = ${auth_user.id}
      AND ${follow_table.target_type} = 'user'
    )`.as('is_following_me'),
  })
  .from(user_table).offset(offset).limit(limit)

  const count = (await db.select().from(user_table)).length
  return c.json({ users, count })
})

router.openapi(createRoute({
  tags: ['user'], description: `列出所有用户(包括group)\n- is_following: auth_user 是否关注 list中的, 某个用户(或group)\n- is_following_me: list中的用户(group)是否关注 auth_user\n- type: user 或 group`,
  method: "get", path: "/user/with-group",
  request: {
    query: offset_limit_query_schema,
  },
  responses: {
    [200]: {description: "返回用户列表"},
    [401]: {description: "未登录"},
  }
}), async (c) => {
  const CU_ret = await get_current_user_and_res(c)
  if (!CU_ret.success) return c.json(CU_ret.json_body, CU_ret.status)
  const auth_user = CU_ret.user

  const { offset, limit } = c.req.valid("query")

  const users = db.select({
    id: user_table.id,
    name: user_table.name,
    nickname: user_table.nickname,
    image: user_table.image,
    is_following: sql<boolean>`EXISTS (
      SELECT 1 FROM ${follow_table}
      WHERE ${follow_table.follower_id} = ${auth_user.id}
      AND ${follow_table.target_id} = ${user_table.id}
      AND ${follow_table.target_type} = 'user'
    )`.as('is_following'),
    is_following_me: sql<boolean>`EXISTS (
      SELECT 1 FROM ${follow_table}
      WHERE ${follow_table.follower_id} = ${user_table.id}
      AND ${follow_table.target_id} = ${auth_user.id}
      AND ${follow_table.target_type} = 'user'
    )`.as('is_following_me'),
    type: sql<string>`'user'`.as('type'),
  }).from(user_table)
  
  const groups = db.select({
    id: group_table.id,
    name: group_table.name,
    nickname: group_table.nickname,
    image: group_table.image,
    is_following: sql<boolean>`EXISTS (
      SELECT 1 FROM ${follow_table}
      WHERE ${follow_table.follower_id} = ${auth_user.id}
      AND ${follow_table.target_id} = ${group_table.id}
      AND ${follow_table.target_type} = 'group'
    )`.as('is_following'),
    // is_following_me: sql<boolean>`EXISTS (
    //   SELECT 1 FROM ${follow_table}
    //   WHERE ${follow_table.follower_id} = ${user.id}
    //   AND ${follow_table.target_id} = ${auth_user.id}
    //   AND ${follow_table.target_type} = 'group'
    // )`.as('is_following_me'),
    is_following_me: sql<boolean>`false`.as('is_following_me'),
    type: sql<string>`'group'`.as('type'),
  }).from(group_table)

  const users_U_groups_list = await unionAll(users, groups).offset(offset).limit(limit)
  const count = (await db.select().from(user_table)).length + (await db.select().from(group_table)).length
  return c.json({ users: users_U_groups_list, count })
})

export default router