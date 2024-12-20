import { OpenAPIHono } from "@hono/zod-openapi";
import defaultHook from "../openapi/default-hook";

export  function createRouter() {
  return new OpenAPIHono({
    defaultHook,
  }).basePath('/api/hono')
}
export default function createApp() {
  const app = createRouter() // hono 采用的 每个路由都是一个独立的实例， 不过之后会注册到一个实例上
  return app
}