import { AuthType, AuthTypeNotNull } from "@/lib/auth";
import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    session: AuthTypeNotNull;
  };
}
export type AppOpenAPI = OpenAPIHono<AppBindings>;
// export type AppOpenAPI = OpenAPIHono

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R>