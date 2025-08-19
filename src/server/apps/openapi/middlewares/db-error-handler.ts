import { MiddlewareHandler } from 'hono';
import { AppError, ErrStatusCode, HTTPResponseError } from './on-error';
import type { ClientErrorStatusCode, InfoStatusCode, RedirectStatusCode, ServerErrorStatusCode, StatusCode, UnofficialStatusCode } from "hono/utils/http-status";
import type { PostgresError } from 'postgres';
import { DrizzleQueryError } from 'drizzle-orm';

// PostgreSQL 错误码常量
const PG_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
} as const;

export const analyzeDBError = (err: Error): ErrStatusCode => {
  const cause = err.cause as PostgresError | undefined;
  if (cause) {
    console.log("DB Error:", cause);
    err.message = cause.detail || cause.message
    return 400;
  }
  return 500; 
}

