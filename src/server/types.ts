import { AuthType, AuthTypeNotNull } from "@/lib/auth";
import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { PinoLogger } from "hono-pino";

export interface AppEnv {
  Variables: { // 用于 c.var
    logger: PinoLogger;
    session: AuthTypeNotNull;
  };
  Bindings: { // 用于 c.env 在 Cloudflare Worker 环境中
    NODE_ENV?: string; // 环境变量
  }
}
export type AppOpenAPI = OpenAPIHono<AppEnv>;
// export type AppOpenAPI = OpenAPIHono

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R>