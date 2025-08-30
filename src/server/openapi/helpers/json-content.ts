import type { ZodSchema } from "./types";
import { messageObjectSchema, validationErrorSchema } from "../schemas/res";

export const jsonContent = <
  T extends ZodSchema,
>(schema: T,
  description: string,
) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}; // "Unknown zod object type, please specify 'type' and other OpenAPI props using 'ZodSchema.openapi'"

export const jsonContentRequest = <
  T extends ZodSchema,
>(schema: T,
  description: string,
) => {
  return {
    body: jsonContent(schema, description),
  };
}

export const jsonContentResponseWith422 = <
  T extends ZodSchema,
>(okSchema: T,
  description: string,
  reqBodySchema?: ZodSchema
) => {
  return {
    200: jsonContent(okSchema, description),
    422: reqBodySchema ? jsonContent(validationErrorSchema(reqBodySchema), "Schema Validation error") : undefined,
  };
}
export const res201 = <
  T extends ZodSchema,
>(okSchema: T) => {
  return {
    201: jsonContent(okSchema, 'Created successfully'),
  };
}
export const resWith401 = <
  T extends ZodSchema,
>(okSchema: T,
  description: string) => {
  return {
    200: jsonContent(okSchema, description),
    401: jsonContent(messageObjectSchema(), "Unauthorized"),
  };
}
// export const resWith401_422 = <
//   T extends ZodSchema,
// >(okSchema: T,
//   description: string) => {
//   return {
//     200: jsonContent(okSchema, description),
//     401: jsonContent(messageObjectSchema(), "Unauthorized"),
//   };
// }
export const jsonContentResponseWith400 = <
  T extends ZodSchema,
>(okSchema: T,
  description: string,
  reqBodySchema?: ZodSchema
) => {
  return {
      200: jsonContent(okSchema, description),
      400: jsonContent(messageObjectSchema(), "Bad Request"),
      422: reqBodySchema ? jsonContent(validationErrorSchema(reqBodySchema), "Schema Validation error") : undefined,
  };
}
export const jsonContentResponseWith400_401_422 = <
  T extends ZodSchema,
>(okSchema: T,
  description: string,
  reqBodySchema: ZodSchema
) => {
  return {
    200: jsonContent(okSchema, description),
    400: jsonContent(messageObjectSchema(), "Bad Request"),
    401: jsonContent(messageObjectSchema(), "Unauthorized"),
    422: jsonContent(validationErrorSchema(reqBodySchema), "Schema Validation error"),
  };
}

export const reqResWith400_401_422 = <
  OkSchemaT extends ZodSchema, ReqBodySchema extends ZodSchema 
>(okSchema: OkSchemaT, okDescription: string, reqBodySchema: ReqBodySchema, reqDescription: string) => {
  return {
    request: jsonContentRequest(reqBodySchema, reqDescription),
    responses: jsonContentResponseWith400_401_422(okSchema, okDescription, reqBodySchema),
  };
}

export const reqRes201 = <
  OkSchemaT extends ZodSchema, ReqBodySchema extends ZodSchema 
>(reqBodySchema: ReqBodySchema, okSchema: OkSchemaT, ) => {
  return {
    request: jsonContentRequest(reqBodySchema, 'insert data'),
    responses: res201(okSchema),
  };
}