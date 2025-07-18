import createApp from "@/server/createApp";

// import admin from '@/server/admin/app';
// import test from '@/server/routes/test/index'
import auth from '@/server/apps/auth/router'
import openapi from '@/server/apps/openapi/router'
import follow from '@/server/apps/follow/router'
import friend from '@/server/apps/friend/router'
import notification from '@/server/apps/notification/router'
// import users from '@/server/routes/users/route'
// // import users_get from '@/server/routes/users/get'
// import user from '@/server/routes/user/route'
// import groups from '@/server/routes/groups/route'
// import follow from '@/server/routes/follow/route'
// import friend from '@/server/routes/friend/route'
// import chats from '@/server/routes/chats/route'
// import project from '@/server/routes/project/route'
// import upload from '@/server/routes/upload/route'

import configOpenAPI from "@/server/apps/openapi/confOpenapi";

const app = createApp()

const routes = [
  auth,
  openapi,
  follow,
  friend,
  notification,
  // users,
  // users_get,
  // user,
  // groups,
  // follow,
  // friend,
  // chats,
  // project,
  // upload,
  // admin,
] as const;

configOpenAPI(app)

routes.forEach(route => {
  app.route("/", route)
})

export default app // for Cloudflare Workers or Bun

export type AppType = typeof routes[number];
// export type AppTypes = typeof _app;