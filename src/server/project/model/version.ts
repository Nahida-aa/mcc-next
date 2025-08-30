import { projectVersion, versionFile } from "@/server/admin/db/schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "../../openapi/schemas/create";
import { z } from "@hono/zod-openapi";

export const versionSelectSchema = createSelectSchema(projectVersion);
export const versionFileSelectSchema = createSelectSchema(versionFile);

export const insertVersionFileSchema = createInsertSchema(versionFile).omit({  downloadCount: true, createdAt: true, updatedAt: true, sha1: true, sha256: true, size: true, uploadStatus: true }).extend({
  id: z.uuid()
});
export type InsertVersionFile = z.infer<typeof insertVersionFileSchema>;

export const addVersionFileSchema = insertVersionFileSchema.omit({id: true,versionId:true, storageKey:true });
export type AddVersionFile = z.infer<typeof addVersionFileSchema>;

export const versionInsertSchema = createInsertSchema(projectVersion);
export type VersionInsert = typeof projectVersion.$inferInsert;

export const createVersionSchema = versionInsertSchema.omit({ id: true, downloadCount: true, createdAt: true, status: true, publisherId: true });
export type CreateVersion = z.infer<typeof createVersionSchema>;

export const createVersionWithFilesSchema = createVersionSchema.extend({
  versionFiles: z.array(addVersionFileSchema),
});


// R
export const projectIdVersionIdParamsSchema = z.object({
  projectId: z.uuid(),
  versionId: z.uuid()
});
export const uploadUrlSchema = z.object({
  fileId: z.string().openapi({ example: "file123" }),
  name: z.string().openapi({ example: "mod.jar" }),
  uploadUrl: z.string().openapi({ example: "https://r2.example.com/presigned-url" }),
  storageKey: z.string().openapi({ example: "projects/abc123/versions/1.0.0/mod.jar" })
});
export type UploadUrl = z.infer<typeof uploadUrlSchema>;

// U
export const fileOperationsSchema = z.object({
  // 新增文件
  add: z.array(addVersionFileSchema).optional(),
  // 删除文件（通过fileId）
  delete: z.array(z.string()).optional(),
  // 更新文件信息（不包括文件本身）
  update: z.array(z.object({
    fileId: z.string(),
    name: z.string().optional(),
    isPrimary: z.boolean().optional(),
    gameVersions: z.array(z.string()).optional(),
    loaders: z.array(z.string()).optional(),
  })).optional()
}).optional();
export type FileOperations = z.infer<typeof fileOperationsSchema>;

export const updateVersionSchema = createUpdateSchema(projectVersion).omit({id: true, projectId: true, downloadCount: true, createdAt: true });
export type UpdateVersion = z.infer<typeof updateVersionSchema>;

export const updateVersionWithOperationsSchema = createUpdateSchema(projectVersion).omit({id: true, projectId: true, downloadCount: true, createdAt: true }).extend({
  // 文件变更操作
  fileOperations: fileOperationsSchema
});
