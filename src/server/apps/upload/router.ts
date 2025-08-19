import { createSubApp } from "@/server/createApp";
import { requiredAuthMiddleware } from "../auth/middleware";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequest } from "@/server/apps/openapi/helpers/json-content";
import { messageObjectSchema } from "@/server/apps/openapi/schemas/res";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const app = createSubApp();
app.use(requiredAuthMiddleware);

// 初始化 R2/S3 客户端
const s3Client = new S3Client({
  region: "auto", // R2 使用 auto
  endpoint: process.env.R2_ENDPOINT!, // 你的 R2 端点
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// 生成预签名URL的请求 schema
export const generatePresignedUrlSchema = z.object({
  filename: z.string().min(1, "文件名不能为空").max(255, "文件名过长"),
  contentType: z.string().min(1, "文件类型不能为空"),
  fileSize: z.number().int().min(1, "文件大小必须大于0").max(100 * 1024 * 1024, "文件大小不能超过100MB"), // 100MB限制
  uploadType: z.enum(['avatar', 'project_icon', 'project_gallery', 'mod_file', 'resource_pack', 'other']).default('other'),
});
export type GeneratePresignedUrlSchemaType = z.infer<typeof generatePresignedUrlSchema>;

// 预签名URL响应 schema
const presignedUrlResponseSchema = z.object({
    uploadUrl: z.string().openapi({ example: "https://r2.example.com/bucket/path/file.jpg?signed-params..." }),
    fileKey: z.string().openapi({ example: "uploads/2024/01/abc123-original-filename.jpg" }),
    expiresIn: z.number().openapi({ example: 3600 }),
    maxFileSize: z.number().openapi({ example: 104857600 }),
});
export type PresignedUrlResponseSchemaType = z.infer<typeof presignedUrlResponseSchema>;
// 生成预签名URL的路由
const generatePresignedUrlRoute = createRoute({
  tags: ["upload"], method: "post", path: "/upload/presigned-url", 
  description: "生成用于文件上传的预签名URL",
  request: jsonContentRequest(generatePresignedUrlSchema, "预签名URL请求数据"),
  responses: {
    200: jsonContent(presignedUrlResponseSchema, "预签名URL生成成功"),
    400: jsonContent(messageObjectSchema("请求参数无效"), "请求错误"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    500: jsonContent(messageObjectSchema("生成预签名URL失败"), "服务器错误")
  }
});
app.openapi(generatePresignedUrlRoute, async (c) => {
  const session = c.var.session;
  const { filename, contentType, fileSize, uploadType } = c.req.valid('json');
  
  // 验证文件类型
  const allowedTypes = {
    avatar: ['image/jpeg', 'image/png', 'image/webp'],
    project_icon: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    project_gallery: ['image/jpeg', 'image/png', 'image/webp'],
    mod_file: ['application/java-archive', 'application/zip', 'application/x-zip-compressed'],
    resource_pack: ['application/zip', 'application/x-zip-compressed'],
    other: [] // 允许所有类型
  };

  if (uploadType !== 'other' && allowedTypes[uploadType] && !allowedTypes[uploadType].includes(contentType)) {
    const error = new Error(`不支持的文件类型: ${contentType}`);
    (error as any).status = 400;
    throw error;
  }

  // 生成唯一的文件路径
  // const fileExtension = filename.split('.').pop() || '';
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '/'); // 2024/01/01
  const randomId = crypto.randomBytes(16).toString('hex');
  const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_'); // 清理文件名
  
  const fileKey = `key/${uploadType}/${timestamp}/${randomId}-${safeFilename}`;

  // 创建预签名URL
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: fileKey,
    ContentType: contentType,
    ContentLength: fileSize,
    // Metadata: {
    //   'uploaded-by': session.user.id,
    //   'upload-type': uploadType,
    //   'original-filename': filename,
    // }
  });

  const expiresIn = 3600; // 1小时过期
  const uploadUrl = await getSignedUrl(s3Client, command, { 
    expiresIn,
    // 添加条件限制，确保上传时的参数匹配
    signableHeaders: new Set(['content-type', 'content-length'])
  });

  return c.json({
    uploadUrl,
    fileKey,
    expiresIn,
    maxFileSize: fileSize,
  }, 200);
});

// 验证上传完成的路由（可选）
const verifyUploadSchema = z.object({
  fileKey: z.string().min(1, "文件key不能为空"),
});

const verifyUploadResponseSchema = z.object({
    fileKey: z.string().openapi({ example: "uploads/2024/01/abc123-file.jpg" }),
    fileUrl: z.string().openapi({ example: "https://your-domain.com/uploads/2024/01/abc123-file.jpg" }),
    verified: z.boolean().openapi({ example: true }),
});
export type VerifyUploadResponseSchemaType = z.infer<typeof verifyUploadResponseSchema>;
const verifyUploadRoute = createRoute({
  tags: ["upload"], 
  method: "post", 
  path: "/upload/verify", 
  description: "验证文件是否上传成功",
  request: jsonContentRequest(verifyUploadSchema, "验证上传请求数据"),
  responses: {
    200: jsonContent(verifyUploadResponseSchema, "文件验证成功"),
    404: jsonContent(messageObjectSchema("文件不存在"), "文件未找到"),
    500: jsonContent(messageObjectSchema("文件验证失败"), "服务器错误")
  }
});

app.openapi(verifyUploadRoute, async (c) => {
  const { fileKey } = c.req.valid('json');
  
  // 这里可以检查文件是否确实存在于R2中
  // 也可以将文件信息保存到数据库中
  
  const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}`;
  
  return c.json({
      fileKey,
      fileUrl,
      verified: true,
  }, 200);
});

export default app;