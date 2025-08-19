import createApp from "@/server/createApp";

// import admin from '@/server/admin/app';
// import test from '@/server/routes/test/index'
import auth from '@/server/apps/auth/router'
import openapi from '@/server/apps/openapi/router'
import follow from '@/server/apps/follow/router'
import friend from '@/server/apps/friend/router'
import notification from '@/server/apps/notification/router'
import project from '@/server/apps/project/router/index'
import project_member from '@/server/apps/project/router/member'
import projectVersion from '@/server/apps/project/router/version'
import upload from '@/server/apps/upload/router'
// import users from '@/server/routes/users/route'
// // import users_get from '@/server/routes/users/get'
// import user from '@/server/routes/user/route'
// import groups from '@/server/routes/groups/route'
// import follow from '@/server/routes/follow/route'
// import friend from '@/server/routes/friend/route'
// import chats from '@/server/routes/chats/route'
// import project from '@/server/routes/project/route'

import configOpenAPI from "@/server/apps/openapi/confOpenapi";

const app = createApp()

const routers = [
  auth,
  openapi,
  follow,
  friend,
  notification,
  project,
  project_member,
  projectVersion,
  upload,
  // users,
  // users_get,
  // user,
  // groups,
  // follow,
  // friend,
  // chats,
  // admin,
] as const;

configOpenAPI(app)

routers.forEach(router => {
  app.route("/", router)
})

export default app // for Cloudflare Workers or Bun

export type AppType = typeof routers[number];
// export type AppTypes = typeof _app;