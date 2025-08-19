import { createSubApp } from "@/server/createApp";
import { requiredAuthMiddleware } from "@/server/apps/auth/middleware";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequest } from "@/server/apps/openapi/helpers/json-content";
import { messageObjectSchema } from "@/server/apps/openapi/schemas/res";
import { db } from "@/server/db";
import { eq, and, sql } from "drizzle-orm";
import { HTTPResponseError, AppError } from "@/server/apps/openapi/middlewares/on-error";
import { generatePresignedUploadUrl, generatePresignedDownloadUrl } from "@/server/apps/upload/r2-storage";
import { IdUUIDParamsSchema, SlugUnicodeParamsSchema } from "../../openapi/schemas/req";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "../../openapi/schemas/create";
import { genPrimaryFilename } from "@/server/apps/project/version/func";
import crypto from "crypto";
import { project, projectMember, projectVersion, versionFile } from "../table";
import { versionFileInsertSchema, versionFileSelectSchema, VersionInsert, versionInsertSchema, versionSelectSchema } from "../model/version";
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
  tags: ["project_version"], method: "get", path: "/project/version/{version_id}",
  description: "获取版本信息",
  request: { params: IdUUIDParamsSchema },
  responses: {
    200: jsonContent(versionSelectSchema, "成功获取版本信息"),
    404: jsonContent(messageObjectSchema("版本未找到"), "版本未找到"),
    500: jsonContent(messageObjectSchema("服务器错误"), "服务器错误")
  }
});
app.openapi(getVersionRoute, async (c) => {
  const { id: version_id } = c.req.valid('param');
  // 查询版本信息
  const versionInfo = await db.select().from(projectVersion)
    .where(eq(projectVersion.id, version_id))
    .limit(1);
  if (versionInfo.length === 0) {
    throw new AppError(404, '版本未找到');
  }
  return c.json(versionInfo[0], 200);
});

const listVersionRoute = createRoute({
  tags: ["project_version"], method: "get", path: "/project/{slug}/versions",
  description: "获取项目所有版本信息",
  request: { params: SlugUnicodeParamsSchema },
  responses: {
    200: jsonContent(z.array(versionSelectSchema), "成功获取版本列表"),
    404: jsonContent(messageObjectSchema("项目未找到"), "项目未找到"),
    500: jsonContent(messageObjectSchema("服务器错误"), "服务器错误")
  }
});
app.openapi(listVersionRoute, async (c) => {
  const { slug: project_slug } = c.req.valid('param');
  
  // 查询项目ID
  const projectInfo = await db.select({ id: project.id })
    .from(project)
    .where(eq(project.slug, project_slug))
    .limit(1);
  
  if (projectInfo.length === 0) {
    throw new AppError(404, '项目未找到');
  }
  
  // 查询所有版本信息
  const versions = await db.select().from(projectVersion)
    .where(eq(projectVersion.projectId, projectInfo[0].id));
  
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
  const { id: version_id } = c.req.valid('param');
  const files = await db.select().from(versionFile).where(eq(versionFile.version_id, version_id));
  if (files.length === 0) { throw new AppError(404, '版本未找到');}
  return c.json(files, 200);
});

// 文件下载路由
const downloadFileRoute = createRoute({
  tags: ["project_version"], method: "get", path: "/project/file/{file_id}/download",
  description: "下载版本文件",
  request: { params: IdUUIDParamsSchema },
  responses: {
    302: { description: "重定向到下载链接" },
    404: jsonContent(messageObjectSchema("文件未找到"), "文件未找到"),
    500: jsonContent(messageObjectSchema("服务器错误"), "服务器错误")
  }
});

app.openapi(downloadFileRoute, async (c) => {
  const { id: file_id } = c.req.valid('param');
  
  // 查询文件信息
  const fileInfo = await db.select().from(versionFile)
    .where(eq(versionFile.id, file_id))
    .limit(1);
  
  if (fileInfo.length === 0) {
    throw new AppError(404, '文件未找到');
  }
  
  const file = fileInfo[0];
  
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
      .where(eq(versionFile.id, file_id));
    
    // 重定向到下载链接
    return c.redirect(downloadUrl);
  } catch (error) {
    console.error('生成下载链接失败:', error);
    throw new AppError(500, '生成下载链接失败');
  }
});

app.use(requiredAuthMiddleware);



const uploadUrlSchema = z.object({
  file_id: z.string().openapi({ example: "file123" }),
  filename: z.string().openapi({ example: "mod.jar" }),
  upload_url: z.string().openapi({ example: "https://r2.example.com/presigned-url" }),
  storage_key: z.string().openapi({ example: "projects/abc123/versions/1.0.0/mod.jar" })
});
type UploadUrl = z.infer<typeof uploadUrlSchema>;
const createVersionRoute = createRoute({
  tags: ["project_version"],  method: "post", path: "/project/version", 
  description: "创建项目版本并获取文件上传链接",
  request: jsonContentRequest(versionInsertSchema, "创建版本的请求数据"),
  responses: {
    200: jsonContent(z.object({
      version_id: z.string().openapi({ example: "abc123def456" }),
      upload_urls: z.array(uploadUrlSchema)
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
  const {versionFiles, ...reqVersion} = c.req.valid('json');
  // 检查项目是否存在且用户有权限
  const projectInfo = await db.select({ 
    id: project.id, 
    ownerId: project.ownerId,
    ownerType: project.ownerType 
  }).from(project).where(eq(project.id, reqVersion.projectId)).limit(1);
  
  if (projectInfo.length === 0) {throw new AppError(404, '项目不存在');}
  
  // 检查权限：项目所有者或有写权限的成员
  if (projectInfo[0].ownerId !== session.user.id) {
    const memberPermission = await db.select({ role: projectMember.role })
      .from(projectMember)
      .where(and(
        eq(projectMember.projectId, reqVersion.projectId),
        eq(projectMember.entityId, session.user.id),
        eq(projectMember.status, 'active')
      )).limit(1);
    
    if (memberPermission.length === 0 || !['owner', 'maintainer'].includes(memberPermission[0].role)) { throw new AppError(403, '无权限操作此项目');}
  }
  // 检查版本号是否已存在
  const existingVersion = await db.select({ id: projectVersion.id })
    .from(projectVersion)
    .where(and(
      eq(projectVersion.projectId, reqVersion.projectId),
      eq(projectVersion.versionNumber, reqVersion.versionNumber)
    )).limit(1);
  if (existingVersion.length > 0) { throw new AppError(400, '版本号已存在');}
  
  // 使用事务创建版本和文件记录
  const result = await db.transaction(async (tx) => {
    try {
      // 创建版本记录
      const newVersion = await tx.insert(projectVersion).values({
        ...reqVersion,
        publisherId: session.user.id
      }).returning({ id: projectVersion.id });
      
      const versionId = newVersion[0].id;
      
      // 创建文件记录并生成预签名URL
      const fileRecordsToInsert: Array<VersionInsert & { versionId: string; storageKey: string }> = [];
      // 准备文件记录数据
      for (let i = 0; i < versionFiles.length; i++) {
        const fileInfo = versionFiles[i];
        // 生成固定的存储key，使用文件ID作为唯一标识，避免后续重命名
        // 格式: projects/{projectId}/versions/{version_id}/{file_uuid}
        // 下载时通过 Content-Disposition 控制实际文件名
        const fileId = crypto.randomUUID(); // 生成文件唯一标识
        const storageKey = `projects/${reqVersion.projectId}/versions/${versionId}/${fileId}`;
        
        fileRecordsToInsert.push({
          ...fileInfo,
          versionId: versionId,
          storageKey: storageKey
        });
      }
      // 批量插入文件记录
      const newFiles = await tx.insert(versionFile).values(fileRecordsToInsert).returning({ 
        id: versionFile.id, 
        storageKey: versionFile.storageKey 
      });

      const uploadUrls: Array<UploadUrl> = []
      // 生成预签名URL
      for (let i = 0; i < versionFiles.length; i++) {
        const fileInfo = versionFiles[i];
        const newFile = newFiles[i];
        
        // 确保 storage_key 不为 null
        if (!newFile.storageKey) {
          throw new Error(`文件 ${fileInfo.name} 的存储键生成失败`);
        }
        
        try {
          // 生成预签名URL
          const uploadUrl = await generatePresignedUploadUrl(newFile.storageKey, fileInfo.type);
          
          uploadUrls.push({
            file_id: newFile.id,
            filename: fileInfo.name,
            upload_url: uploadUrl,
            storage_key: newFile.storage_key
          });
        } catch (urlError) {
          console.error('生成预签名URL失败:', urlError);
          throw new Error(`生成文件 ${fileInfo.name} 的上传链接失败`);
        }
      }
      
      return {
        version_id: versionId,
        upload_urls: uploadUrls
      };
    } catch (error) {
      console.error('创建版本失败:', error);
      throw error;
    }
  });
  
  return c.json(result, 200);
});

const deleteVersionRoute = createRoute({
  tags: ["project_version"],method: "delete",path: "/project/version/{version_id}",
  description: "删除项目版本",
  request: { params: IdUUIDParamsSchema },
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
  const session = c.var.session;
  const { id: version_id } = c.req.valid('param');
  
  // 查找版本信息
  const versionInfo = await db.select({
    id: projectVersion.id,
    status: projectVersion.status,
    author_id: projectVersion.publisherId,
    projectId: projectVersion.projectId,
    versionNumber: projectVersion.versionNumber
  })
  .from(projectVersion)
  .where(eq(projectVersion.id, version_id))
  .limit(1);
  
  if (versionInfo.length === 0) {
    throw new AppError(404, '版本不存在');
  }
  
  const version = versionInfo[0];
  
  // 验证权限：必须是版本创建者或项目管理员
  if (version.author_id !== session.user.id) {
    const memberPermission = await db.select({ role: projectMember.role })
      .from(projectMember)
      .where(and(
        eq(projectMember.projectId, version.projectId),
        eq(projectMember.user_id, session.user.id),
        eq(projectMember.status, 'active')
      ))
      .limit(1);
    
    if (memberPermission.length === 0 || !['owner', 'maintainer'].includes(memberPermission[0].role)) {
      throw new AppError(403, '无权限删除此版本');
    }
  }
  
  // 检查版本状态：不能删除已发布的版本
  if (version.status === 'published') {
    throw new AppError(400, '无法删除已发布的版本，请先归档版本');
  }
  
  // 使用事务删除版本及其相关文件记录
  await db.transaction(async (tx) => {
    // 删除文件记录
    await tx.delete(versionFile)
      .where(eq(versionFile.version_id, version_id));
    
    // 删除版本记录
    await tx.delete(projectVersion)
      .where(eq(projectVersion.id, version_id));
  });
  
  return c.json({
    message: `版本 ${version.versionNumber} 已删除`
  }, 200);
});

const versionUpdateSchema = createUpdateSchema(projectVersion, {
  game_versions: z.array(z.string()),
  loaders: z.array(z.string()),
}).omit({id: true, projectId: true, download_count: true, createdAt: true }).extend({
  // 文件变更操作
  fileOperations: z.object({
    // 新增文件
    add: z.array(versionFileInsertSchema).optional(),
    // 删除文件（通过file_id）
    delete: z.array(z.string()).optional(),
    // 更新文件信息（不包括文件本身）
    update: z.array(z.object({
      file_id: z.string(),
      name: z.string().optional(),
      is_primary: z.boolean().optional(),
      game_versions: z.array(z.string()).optional(),
      loaders: z.array(z.string()).optional(),
    })).optional()
  }).optional()
});
const updateVersionRoute = createRoute({
  tags: ["project_version"],method: "patch",path: "/project/version/{version_id}",description: "更新项目版本信息和文件",
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContent(versionUpdateSchema, "更新版本的数据")
  },
  responses: {
    200: jsonContent(z.object({
      message: z.string(),
      upload_urls: z.array(uploadUrlSchema).optional() // 新增文件时返回上传链接
    }), "版本信息已更新"),
    400: jsonContent(messageObjectSchema("无法更新已发布的版本"), "请求错误"),
    401: jsonContent(messageObjectSchema("未授权访问"), "未授权"),
    403: jsonContent(messageObjectSchema("无权限更新此版本"), "权限不足"),
    404: jsonContent(messageObjectSchema("版本不存在"), "版本未找到"),
    500: jsonContent(messageObjectSchema("更新失败"), "服务器错误")
  }
});
app.openapi(updateVersionRoute, async (c) => {
  const session = c.var.session;
  const { id: version_id } = c.req.valid('param');
  const { fileOperations, ...versionUpdateData } = c.req.valid('json');
  
  // 查找版本信息
  const versionInfo = await db.select({
    id: projectVersion.id,
    status: projectVersion.status,
    author_id: projectVersion.publisherId,
    projectId: projectVersion.projectId,
    versionNumber: projectVersion.versionNumber
  })
  .from(projectVersion)
  .where(eq(projectVersion.id, version_id))
  .limit(1);
  
  if (versionInfo.length === 0) {
    throw new AppError(404, '版本不存在');
  }
  
  const version = versionInfo[0];
  
  // 验证权限：必须是版本创建者或项目管理员
  if (version.author_id !== session.user.id) {
    const memberPermission = await db.select({ role: projectMember.role })
      .from(projectMember)
      .where(and(
        eq(projectMember.projectId, version.projectId),
        eq(projectMember.user_id, session.user.id),
        eq(projectMember.status, 'active')
      ))
      .limit(1);
    
    if (memberPermission.length === 0 || !['owner', 'maintainer'].includes(memberPermission[0].role)) {
      throw new AppError(403, '无权限更新此版本');
    }
  }
  
  // 检查版本状态：不能更新已发布的版本
  if (version.status === 'published') {
    throw new AppError(400, '无法更新已发布的版本');
  }
  
  // 使用事务处理版本和文件更新
  const result = await db.transaction(async (tx) => {
    let uploadUrls: Array<UploadUrl> = [];
    
    // 1. 更新版本基本信息
    if (Object.keys(versionUpdateData).length > 0) {
      await tx.update(projectVersion)
        .set(versionUpdateData)
        .where(eq(projectVersion.id, version_id));
    }
    
    // 2. 处理文件操作
    if (fileOperations) {
      // 2.1 删除文件
      if (fileOperations.delete && fileOperations.delete.length > 0) {
        // 验证文件是否属于此版本 (避免误删除其他版本的文件)
        const filesToDelete = await tx.select({ 
          id: versionFile.id, 
          storage_key: versionFile.storage_key 
        }).from(versionFile)
        .where(and(
          eq(versionFile.version_id, version_id),
          // 使用 SQL 的 IN 操作符
          sql`${versionFile.id} = ANY(${fileOperations.delete})`
        ));
        
        if (filesToDelete.length > 0) {
          // 删除数据库记录
          await tx.delete(versionFile)
            .where(and(
              eq(versionFile.version_id, version_id),
              sql`${versionFile.id} = ANY(${fileOperations.delete})`
            ));
          
          // TODO: 删除存储文件（可以异步处理或加入删除队列）
          // for (const file of filesToDelete) {
          //   await deleteStorageFile(file.storage_key);
          // }
        }
      }
      
      // 2.2 更新文件信息
      if (fileOperations.update && fileOperations.update.length > 0) {
        for (const fileUpdate of fileOperations.update) {
          const { file_id, ...updateFields } = fileUpdate;
          
          // 验证文件是否属于此版本
          const existingFile = await tx.select({ id: versionFile.id })
            .from(versionFile)
            .where(and(
              eq(versionFile.id, file_id),
              eq(versionFile.version_id, version_id)
            ))
            .limit(1);
          
          if (existingFile.length === 0) {
            throw new Error(`文件 ${file_id} 不存在或不属于此版本`);
          }
          
          // 注意：为了避免 S3 重命名费用，storage_key 一旦创建就不再修改
          // 只更新文件的显示信息，下载时通过 Content-Disposition 控制文件名
          await tx.update(versionFile)
            .set(updateFields) // 不包含 storage_key 的更新
            .where(eq(versionFile.id, file_id));
        }
      }
      
      // 2.3 新增文件
      if (fileOperations.add && fileOperations.add.length > 0) {
        const fileRecordsToInsert: Array<typeof versionFileInsertSchema.type & { version_id: string; storage_key: string }> = [];
        
        // 准备新文件记录
        for (const fileInfo of fileOperations.add) {
          // 使用固定的存储key格式，避免后续重命名费用
          const fileId = crypto.randomUUID();
          const storageKey = `projects/${version.projectId}/versions/${version_id}/${fileId}`;
          
          fileRecordsToInsert.push({
            ...fileInfo,
            version_id: version_id,
            storage_key: storageKey
          });
        }
        
        // 批量插入新文件记录
        const newFiles = await tx.insert(versionFile).values(fileRecordsToInsert).returning({ 
          id: versionFile.id, 
          storage_key: versionFile.storage_key 
        });
        
        // 生成预签名URL
        for (let i = 0; i < fileOperations.add.length; i++) {
          const fileInfo = fileOperations.add[i];
          const newFile = newFiles[i];
          
          if (!newFile.storage_key) {
            throw new Error(`文件 ${fileInfo.name} 的存储键生成失败`);
          }
          
          try {
            const uploadUrl = await generatePresignedUploadUrl(newFile.storage_key, fileInfo.type);
            
            uploadUrls.push({
              file_id: newFile.id,
              filename: fileInfo.name,
              upload_url: uploadUrl,
              storage_key: newFile.storage_key
            });
          } catch (urlError) {
            console.error('生成预签名URL失败:', urlError);
            throw new Error(`生成文件 ${fileInfo.name} 的上传链接失败`);
          }
        }
      }
    }
    
    return { uploadUrls };
  });
  
  return c.json({
    message: `版本 ${version.versionNumber} 信息已更新`,
    upload_urls: result.uploadUrls
  }, 200);
});

export default app;
