import createApp from "@/api/create.app";

import adminDb from '@/server/admin/db/router';
// import test from '@/server/routes/test/index'
import auth from '@/server/auth/router'
import openapi from '@/server/openapi/router'
import friend from '@/server/friend/router'
// import follow from '@/server/follow/router'
import notification from '@/server/notification/router'
import project from '@/server/project/router/index'
import projectMember from '@/server/project/router/member'
import projectVersion from '@/server/project/router/version'
import upload from '@/server/apps/upload/router'
import communityMessage from '@/server/community/router/message'
// import users from '@/server/routes/users/route'
// // import users_get from '@/server/routes/users/get'
// import user from '@/server/routes/user/route'
// import groups from '@/server/routes/groups/route'
// import follow from '@/server/routes/follow/route'
// import friend from '@/server/routes/friend/route'
// import chats from '@/server/routes/chats/route'
// import project from '@/server/routes/project/route'

import configOpenAPI from "@/server/openapi/confOpenapi";
import { wsApp } from "./ws/router";

const app = createApp()
.route("/auth", auth)
.route("/project", project)
.route("/project/member", projectMember)
.route("/project/version", projectVersion)
.route("/friend", friend)
// .route("/follow", follow)
.route("/notification", notification)
.route("/upload", upload)
.route("/community/message", communityMessage)
// .route("/users", users);
// .route("/users/get", users_get);
// .route("/user", user);
// .route("/groups", groups);
// .route("/follow", follow);
// .route("/friend", friend);
// .route("/chats", chats);

// .route("/test", test);

// .route('/openapi', openapi);
.route('/admin/db', adminDb)
.route('', wsApp)

configOpenAPI(app)

export default app // for Cloudflare Workers or Bun

export type AppType = typeof app;
// export type AppTypes = typeof _app;

