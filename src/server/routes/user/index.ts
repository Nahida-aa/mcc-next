import { createRouter } from "@/server/lib/create-app";
import { bearerAuth } from 'hono/bearer-auth'

import * as route from './route'
import * as handler from './handler'
import { getSessionTokenPayloadMiddleware } from "@/server/middleware/auth";

const router = createRouter()
  .openapi(route.list, handler.list)
  .openapi(route.getOne, handler.getOne)
  .openapi(route.getOneByName, handler.getOneByName)
  .openapi(route.create, handler.create)
  // .use(getSessionTokenPayloadMiddleware())
  .openapi(route.patch, handler.patch)
  .openapi(route.patchByName, handler.patchByName)
  .openapi(route.remove, handler.remove)

export default router