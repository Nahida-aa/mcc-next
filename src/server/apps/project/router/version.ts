import { createSubApp } from "@/api/create.app";
import { requiredAuthMiddleware } from "@/server/auth/middleware";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequest } from "@/server/openapi/helpers/json-content";
import { messageObjectSchema } from "@/server/openapi/schemas/res";
import { db } from "@/server/admin/db";
import { eq, and, sql } from "drizzle-orm";
import { AppErr } from "@/server/openapi/middlewares/on-error";
import { generatePresignedUploadUrl, generatePresignedDownloadUrl } from "@/server/apps/upload/r2-storage";
import { IdUUIDParamsSchema, SlugUnicodeParamsSchema } from "../../openapi/schemas/req";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "../../openapi/schemas/create";
import { createVersion, deleteVersion, generateUploadUrls, genPrimaryFilename, mutPrepareVersionFiles, updateVersion } from "@/server/project/service/version";
import crypto from "crypto";
import { project, projectMember, projectVersion, versionFile } from "../table";
import { addVersionFileSchema, createVersionWithFilesSchema, projectIdVersionIdParamsSchema, updateVersionWithOperationsSchema, UploadUrl, uploadUrlSchema, versionFileSelectSchema, VersionInsert, versionInsertSchema, versionSelectSchema } from "../model/version";
import { checkMemberPermission } from "../service/member";
// import { createSelectSchema, createUpdateSchema } from "drizzle-zod";

// API路由规划：
// GET /project/version/{id} - 获取版本信息 不需要登录
// GET /project/{slug}/versions - 获取项目所有版本信息
// GET /project/version/{id}/files - 获取版本文件列表
// POST /project/version - 创建版本(and upload file), 避免有版本但无 文件(记录)的 这种情况出现
// DELETE /project/version/{id} 
// PATCH /project/version/{id} - 更新版本信息

// 功能逻辑规划：
// 1. 创建版本
//   1.1 client request POST /project/version 获得 presignedURL
//   1.2 client request PUT presignedURL body:file
//   1.3 判断是否上传 ok
//   1.3.1 ok: PATCH /project/version/{id} body:{status: 'uploaded'}
//   1.3.1.1 跳转到 /project/{slug}/version/{id} 页面
//   1.3.2 失败: PATCH /project/version/{id}
// 2. 编辑版本: 可能涉及到文件变更
//  PATCH /project/version/{id}
// 3. 删除版本 DELETE /project/version/{id}

const app = createSubApp();
const getVersionRoute = createRoute({
  tags: ["project_version"], method: "get", path: "/project/version/{id}",
  description: "获取版本信息",
  request: { params: IdUUIDParamsSchema },
  responses: {
    200: jsonContent(versionSelectSchema, "成功获取版本信息"),
    404: jsonContent(messageObjectSchema("版本未找到"), "版本未找到"),
    500: jsonContent(messageObjectSchema("服务器错误"), "服务器错误")
  }
});
app.openapi(getVersionRoute, async (c) => {
  const { id: versionId } = c.req.valid('param');
  // 查询版本信息
  const versionInfo = await db.select().from(projectVersion)
    .where(eq(projectVersion.id, versionId)).limit(1);
  if (versionInfo.length === 0) throw AppErr(404, '版本未找到');
  return c.json(versionInfo[0], 200);
});


const listVersionRoute = createRoute({
  tags: ["project_version"], method: "get", path: "/project/{id}/versions",
  description: "获取项目所有版本信息",
  request: { params: IdUUIDParamsSchema },
  responses: {
    200: jsonContent(z.array(versionSelectSchema), "成功获取版本列表"),
    404: jsonContent(messageObjectSchema("项目未找到"), "项目未找到"),
    500: jsonContent(messageObjectSchema("服务器错误"), "服务器错误")
  }
});
app.openapi(listVersionRoute, async (c) => {
  const { id: projectId } = c.req.valid('param');
  // 查询所有版本信息
  const versions = await db.select().from(projectVersion)
    .where(eq(projectVersion.projectId, projectId));
  return c.json(versions, 200);
});

const listVersionFileRoute = createRoute({
  tags: ["project_version"], method: "get", path: "/project/version/{id}/files",
  description: "获取版本文件列表",
  request: { params: IdUUIDParamsSchema },
  responses: {
    200: jsonContent(z.array(versionFileSelectSchema), "成功获取文件列表"),
    404: jsonContent(messageObjectSchema("版本未找到"), "版本未找到"),
    500: jsonContent(messageObjectSchema("服务器错误"), "服务器错误")
  }
});
app.openapi(listVersionFileRoute, async (c) => {
  const { id: versionId } = c.req.valid('param');
  const files = await db.select().from(versionFile).where(eq(versionFile.versionId, versionId));
  if (files.length === 0) { throw AppErr(404, '版本未找到');}
  return c.json(files, 200);
});

// 文件下载路由
const downloadFileRoute = createRoute({
  tags: ["project_version"], method: "get", path: "/project/file/{id}/download",
  description: "下载版本文件",
  request: { params: IdUUIDParamsSchema },
  responses: {
    302: { description: "重定向到下载链接" },
    404: jsonContent(messageObjectSchema("文件未找到"), "文件未找到"),
    500: jsonContent(messageObjectSchema("服务器错误"), "服务器错误")
  }
});

app.openapi(downloadFileRoute, async (c) => {
  const { id: fileId } = c.req.valid('param');
  
  // 查询文件信息
  const [file] = await db.select().from(versionFile)
    .where(eq(versionFile.id, fileId))
    .limit(1);
  
  if (!file) throw AppErr(404, '文件未找到');
  
  
  // 生成用户友好的下载文件名
  const downloadFilename = file.isPrimary 
    ? genPrimaryFilename(file.name, file.loaders || [], file.gameVersions || [])
    : file.name;
  
  try {
    // 生成带自定义文件名的预签名下载链接
    const downloadUrl = await generatePresignedDownloadUrl(
      file.storageKey!, 
      downloadFilename, 
      300 // 5分钟有效期
    );
    
    // 更新下载计数（可以异步处理）
    await db.update(versionFile)
      .set({ downloadCount: file.downloadCount + 1 })
      .where(eq(versionFile.id, fileId));
    
    // 重定向到下载链接
    return c.redirect(downloadUrl);
  } catch (error) {
    console.error('生成下载链接失败:', error);
    throw AppErr(500, '生成下载链接失败');
  }
});

app.use(requiredAuthMiddleware);

const createVersionRoute = createRoute({
  tags: ["project_version"],  method: "post", path: "/project/version", 
  description: "创建项目版本并获取文件上传链接",
  request: jsonContentRequest(createVersionWithFilesSchema, "创建版本的请求数据"),
  responses: {
    200: jsonContent(z.object({
      versionId: z.string().openapi({ example: "abc123def456" }),
      uploadUrls: z.array(uploadUrlSchema)
    }), "版本创建成功"),
    400: jsonContent(messageObjectSchema("版本号已存在"), "请求错误"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    403: jsonContent(messageObjectSchema("无权限操作此项目"), "权限不足"),
    404: jsonContent(messageObjectSchema("项目不存在"), "项目未找到"),
    500: jsonContent(messageObjectSchema("创建版本失败"), "服务器错误")
  }
});
app.openapi(createVersionRoute, async (c) => {
  const session = c.var.session;
  const authId = session.user.id;
  const {versionFiles, ...reqVersion} = c.req.valid('json');
  // 检查项目是否存在且用户有权限
  // const projectInfo = await db.select({ 
  //   id: project.id, 
  //   ownerId: project.ownerId,
  //   ownerType: project.ownerType 
  // }).from(project).where(eq(project.id, reqVersion.projectId)).limit(1);
  
  // if (projectInfo.length === 0) {throw AppErr(404, '项目不存在');}
  
  // 检查权限：项目所有者或有写权限的成员
  
  // // 检查版本号是否已存在
  // const existingVersion = await db.select({ id: projectVersion.id })
  //   .from(projectVersion)
  //   .where(and(
  //     eq(projectVersion.projectId, reqVersion.projectId),
  //     eq(projectVersion.versionNumber, reqVersion.versionNumber)
  //   )).limit(1);
  // if (existingVersion.length > 0) { throw AppErr(400, '版本号已存在');}
  
  const result = await createVersion(reqVersion.projectId, reqVersion, versionFiles, authId);
  return c.json(result, 200);
});

const updateVersionRoute = createRoute({
  tags: ["project_version"],method: "patch",path: "/project/{projectId}/version/{versionId}",description: "更新项目版本信息和文件",
  request: {
    params: projectIdVersionIdParamsSchema,
    body: jsonContent(updateVersionWithOperationsSchema, "更新版本的数据")
  },
  responses: {
    200: jsonContent(z.object({
      message: z.string(),
      uploadUrls: z.array(uploadUrlSchema).optional() // 新增文件时返回上传链接
    }), "版本信息已更新"),
    400: jsonContent(messageObjectSchema("无法更新已发布的版本"), "请求错误"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    403: jsonContent(messageObjectSchema("无权限更新此版本"), "权限不足"),
    404: jsonContent(messageObjectSchema("版本不存在"), "版本未找到"),
    500: jsonContent(messageObjectSchema("更新失败"), "服务器错误")
  }
});
app.openapi(updateVersionRoute, async (c) => {
  const authId = c.var.session.user.id;
  const { projectId, versionId } = c.req.valid('param');
  const { fileOperations, ...versionUpdateData } = c.req.valid('json');
  
  // // 查找版本信息
  // const versionInfo = await db.select({
  //   id: projectVersion.id,
  //   status: projectVersion.status,
  //   author_id: projectVersion.publisherId,
  //   projectId: projectVersion.projectId,
  //   versionNumber: projectVersion.versionNumber
  // })
  // .from(projectVersion)
  // .where(eq(projectVersion.id, versionId))
  // .limit(1);
  
  // if (versionInfo.length === 0) {
  //   throw AppErr(404, '版本不存在');
  // }
  // const version = versionInfo[0];

  const result = await updateVersion(projectId, versionId, versionUpdateData, fileOperations, authId);
  
  return c.json({
    message: `版本 ${versionId} 信息已更新`,
    uploadUrls: result
  }, 200);
});

const deleteVersionRoute = createRoute({
  tags: ["project_version"],method: "delete",path: "/project/{projectId}/version/{versionId}",
  description: "删除项目版本",
  request: { params: projectIdVersionIdParamsSchema },
  responses: {
    200: jsonContent(messageObjectSchema("版本已删除"), "成功"),
    400: jsonContent(messageObjectSchema("无法删除已发布的版本"), "请求错误"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    403: jsonContent(messageObjectSchema("无权限删除此版本"), "权限不足"),
    404: jsonContent(messageObjectSchema("版本不存在"), "版本未找到"),
    500: jsonContent(messageObjectSchema("删除失败"), "服务器错误")
  }
});
app.openapi(deleteVersionRoute, async (c) => {
  const authId = c.var.session.user.id;
  const { projectId, versionId } = c.req.valid('param');
  
  // // 查找版本信息
  // const versionInfo = await db.select({
  //   id: projectVersion.id,
  //   status: projectVersion.status,
  //   author_id: projectVersion.publisherId,
  //   projectId: projectVersion.projectId,
  //   versionNumber: projectVersion.versionNumber
  // })
  // .from(projectVersion)
  // .where(eq(projectVersion.id, versionId))
  // .limit(1);
  
  // if (versionInfo.length === 0) {
  //   throw AppErr(404, '版本不存在');
  // }
  // const version = versionInfo[0];

  await deleteVersion(projectId, versionId , authId);
  
  return c.json({
    message: `版本 ${versionId} 已删除`
  }, 200);
});

export default app;
