import { OpenAPIHono } from "@hono/zod-openapi";
import defaultHook from "@/server/apps/openapi/default-hook";
import { AppEnv, AppOpenAPI } from "@/server/types";
import { requestId } from "hono/request-id";
// import pinoHttp from "pino-http"; // Edge Runtime 不支持
import onError from "@/server/apps/openapi/middlewares/on-error";
import notFound from "@/server/apps/openapi/middlewares/not-found";
import { logger } from "hono/logger";
import { pino } from "pino";
import { pinoLogger } from 'hono-pino' // Pino is designed for Node.js and supports browser environments.
import pretty from 'pino-pretty'; // Pretty print for Pino logs, useful for development


const configLogger = (app: AppOpenAPI) => {
  app.use(requestId());
  // app.use(logger()); // 使用 Hono 内置的 logger，Edge Runtime 兼容
  // app.use(async (c, next) => {
  //   const start = Date.now();
  //   await next();
  //   const ms = Date.now() - start;
  //   console.log(`${c.req.method} ${c.req.url} - ${c.res.status} - ${ms}ms`);
  // });
  app.use(
    pinoLogger({
      pino: pino(
        {level: process.env.NODE_ENV === "production" ? "info" : "debug"},
        process.env.NODE_ENV === "production" ? undefined : pretty()
      )
    }),
  )
}

const configJsonRes = (app: AppOpenAPI) => {
  app.notFound(notFound)
  app.onError(onError)
}

export function createSubApp() {
  const app = new OpenAPIHono<AppEnv>({
    strict: false, // 关闭严格模式，允许未定义的路径, /hello <- /hello or /hello/
    defaultHook,  // 恢复 defaultHook，用于处理验证错误
  })
  // configJsonRes(app)
  
  return app 
}
export default function createApp() {
  const app = createSubApp().basePath('/api') // hono 采用的 每个子app(路由器)都是一个独立的实例， 不过之后会注册到一个实例上
  configLogger(app)
  configJsonRes(app)
  // app.openapi
  return app
}