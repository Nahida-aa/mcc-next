import type { ErrorHandler } from "hono";
// import { HTTPResponseError } from "hono/types";
import type { ClientErrorStatusCode, ContentfulStatusCode, InfoStatusCode, RedirectStatusCode, ServerErrorStatusCode, StatusCode, UnofficialStatusCode } from "hono/utils/http-status";
import { INTERNAL_SERVER_ERROR, OK } from "@/server/openapi/http-status-codes";
import { AppEnv, AppOpenAPI } from "@/server/types";
import { env, getRuntimeKey } from 'hono/adapter'
export type ErrStatusCode = UnofficialStatusCode | ClientErrorStatusCode | ServerErrorStatusCode;
import { HTTPException } from 'hono/http-exception'
import postgres from "postgres";

/**
 * 工厂函数，简化错误处理, 将 HTTP 错误作为 App 错误, 叫做 AppErr , 暂时 按照 HTTP 的状态码来分类错误
 * @example
 * throw AppErr(404, '项目未找到');
 * throw AppErr(403, '无权限操作此项目');
 */
export const AppErr = (status: ContentfulStatusCode, message: string) => {
  return new HTTPException(status, { message });
}

// PostgreSQL 错误码常量
// const PG_ERROR_CODES = {
//   UNIQUE_VIOLATION: '23505',
//   FOREIGN_KEY_VIOLATION: '23503',
//   NOT_NULL_VIOLATION: '23502',
//   CHECK_VIOLATION: '23514',
// } as const;

export const onError: ErrorHandler<AppEnv> = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  } 
  const { NODE_ENV } = env<{ NODE_ENV: string }>(c);
  const {cause} = err;
  if (cause instanceof postgres.PostgresError) {
    return c.json({
      message: cause.detail || cause.message,
      stack: NODE_ENV === "production" ? undefined : err.stack
    }, 400);
  }
  return c.json({
    message: err.message,
    stack: NODE_ENV === "production" ? undefined : err.stack
  }, 500);
};
