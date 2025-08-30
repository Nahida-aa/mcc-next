import { OpenAPIHono } from "@hono/zod-openapi";
import defaultHook from "@/server/openapi/default-hook";
import { AppEnv, AppOpenAPI } from "@/server/types";
import { requestId } from "hono/request-id";
// import pinoHttp from "pino-http"; // Edge Runtime 不支持
import {onError} from "@/server/openapi/middlewares/on-error";
import notFound from "@/server/openapi/middlewares/not-found";
import { logger } from "hono/logger";
// import { pino } from "pino";
// import { pinoLogger } from 'hono-pino' // Pino is designed for Node.js and supports browser environments. 翻译: Pino 旨在用于 Node.js 并支持浏览器环境。
// import pretty from 'pino-pretty'; // Pretty print for Pino logs, useful for development
import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { MiddlewareHandler } from "hono/types";

const aLoggerHono = () => {
  return createMiddleware(async (c, next) => {
    const reqHeader = c.req.header()
    console.log(reqHeader)
    // const reqContentType = c.req.header('content-type') || ''
    // let reqBody: any = null
    // // 根据 content-type 解析请求体
    // // 注意：如果是 multipart/form-data，则需要使用 formData() 方法
    // // 这里为了演示，假设只处理 json、x-www-form-urlencoded 和 text/plain
    // switch (true) {
    //   case reqContentType.includes('application/json'):
    //     reqBody = await c.req.json()
    //     break
    //   case reqContentType.includes('application/x-www-form-urlencoded'):
    //     reqBody = await c.req.formData()
    //     break
    //   case reqContentType.includes('text/'):
    //     reqBody = await c.req.text()
    //     break
    //   default:
    //     // multipart/form-data 或 流 类型，不解析
    //     console.log('Skipping logging body for content-type:', reqContentType)
    // }
    // console.log(JSON.stringify(reqBody, null, 2))

    await next()

    console.log("resHeader:", c.res.headers)
  })
}

const configLogger = (app: AppOpenAPI) => {
  app.use(requestId());
  app.use(logger()); // 使用 Hono 内置的 logger，Edge Runtime 兼容
  app.use(aLoggerHono()); // 自定义日志中间件
  // app.use(
  //   pinoLogger({
  //     pino: pino(
  //       {level: process.env.NODE_ENV === "production" ? "info" : "debug"},
  //       process.env.NODE_ENV === "production" ? undefined : pretty()
  //     )
  //   }),
  // )
}

const configJsonRes = (app: AppOpenAPI) => {
  app.notFound(notFound)
  app.onError(onError)
}


export function createSubApp(middlewareHandler?: MiddlewareHandler<AppEnv>) {
  const app = new OpenAPIHono<AppEnv>({
    strict: false, // 关闭严格模式，允许未定义的路径, /hello <- /hello or /hello/
    defaultHook,  // 恢复 defaultHook，用于处理验证错误
  })
  // configJsonRes(app)
  if (middlewareHandler) return app.use(middlewareHandler) as OpenAPIHono<AppEnv>
  
  return app
}
export default function createApp(basePath?: string) {
  const app = createSubApp().basePath(basePath ?? "") 
  // hono 采用的 每个子app(路由器)都是一个独立的实例， 不过之后会注册到一个实例上
  configLogger(app)
  configJsonRes(app)
  // app.openapi
  return app
}