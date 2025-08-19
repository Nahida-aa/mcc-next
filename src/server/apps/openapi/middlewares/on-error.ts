import type { ErrorHandler } from "hono";
// import { HTTPResponseError } from "hono/types";
import type { ClientErrorStatusCode, InfoStatusCode, RedirectStatusCode, ServerErrorStatusCode, StatusCode, UnofficialStatusCode } from "hono/utils/http-status";
import { INTERNAL_SERVER_ERROR, OK } from "@/server/apps/openapi/http-status-codes";
import { AppEnv, AppOpenAPI } from "@/server/types";
import { env, getRuntimeKey } from 'hono/adapter'
export type ErrStatusCode = UnofficialStatusCode | ClientErrorStatusCode | ServerErrorStatusCode;
import { analyzeDBError } from "./db-error-handler";

export interface HTTPResponseError extends Error {
  // getResponse: () => Response;
  status: StatusCode;
}

/**
 * 自定义App|HTTP错误类，简化错误处理, 将 HTTP 错误作为 App 错误, 叫做 AppError 是因为我们暂时 按照 HTTP 的状态码来分类错误
 * @example
 * throw new AppError(404, '项目未找到');
 * throw new AppError(403, '无权限操作此项目');
 */
export class AppError extends Error implements HTTPResponseError {
  public status: StatusCode;

  constructor(
    status: StatusCode,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    
    // 确保 instanceof 正常工作
    Object.setPrototypeOf(this, AppError.prototype);
  }

  // getResponse(): Response {
  //   return new Response(JSON.stringify({ message: this.message }), {
  //     status: this.status,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }
}


const onError: ErrorHandler<AppEnv> = (err: Error|HTTPResponseError, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;
  // console.log("onError::currentStatus:", currentStatus);
  // != OK 说明: 程序抛出了带有 status 的错误
  const statusCode = currentStatus !== OK
    ? (currentStatus as ErrStatusCode)
    : INTERNAL_SERVER_ERROR;

  // console.log(err.cause);
  const status = analyzeDBError(err);
  // c.var.logger.debug({ cause: err.cause });
  const { NODE_ENV } = env<{ NODE_ENV: string }>(c);
  return c.json({
      message: err.message,
      stack: NODE_ENV === "production" ? undefined : err.stack,
    },
    status,
  );
};

export default onError;