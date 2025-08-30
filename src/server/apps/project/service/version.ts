import { db } from "@/server/admin/db";
import { AppErr } from "../../openapi/middlewares/on-error";
import { checkMemberPermission } from "./member";
import { projectVersion, versionFile } from "@/server/admin/db/schema";
import { AddVersionFile, CreateVersion, FileOperations, InsertVersionFile, UpdateVersion } from "../model/version";
import { generatePresignedUploadUrl } from "../../upload/r2-storage";
import { eq, and, sql } from "drizzle-orm";

// {name}_fabric_1.20.1-1.20.6.{ext}
export const genPrimaryFilename = (name: string, loaders: string[], gameVersions: string[]): string => {
  // 生成主要文件名，包含加载器和游戏版本信息
  const loaderStr = loaders.join('-'); // 多个加载器用-连接
  const gameVersionRange = gameVersions.length > 1 
    ? `${gameVersions[0]}-${gameVersions[gameVersions.length - 1]}`
    : gameVersions[0];
  // 解析文件名和扩展名
  const lastDotIndex = name.lastIndexOf('.');
  const nameWithoutExt = lastDotIndex > 0 ? name.substring(0, lastDotIndex) : name;
  const ext = lastDotIndex > 0 ? name.substring(lastDotIndex) : '';
          
  return `${nameWithoutExt}_${loaderStr}_${gameVersionRange}${ext}`;
}

// C
// 准备 versionFile[]
export const mutPrepareVersionFiles = (files: AddVersionFile[], projectId: string, versionId: string) => {
  // 准备文件记录数据
  const basePath = `projects/${projectId}/versions/${versionId}/`;
  for (let i = 0; i < files.length; i++) {
    // const file = files[i];
    // 生成固定的存储key，使用文件ID作为唯一标识，避免后续重命名
    // 格式: projects/{projectId}/versions/{version_id}/{file_uuid}
    // 下载时通过 Content-Disposition 控制实际文件名
    const fileId = crypto.randomUUID(); // 生成文件唯一标识
    (files[i] as InsertVersionFile).id = fileId;
    (files[i] as InsertVersionFile).versionId = versionId;
    (files[i] as InsertVersionFile).storageKey = `${basePath}${fileId}`;
  }
  return files as InsertVersionFile[]
};
// 生成 uploadUrl[] 
export const generateUploadUrls = async (files: InsertVersionFile[]) => {
  // 为每个文件生成预签名上传URL
  return await Promise.all(files.map(async (file) => {
    const uploadUrl = await generatePresignedUploadUrl(file.storageKey, file.type);
    return {
      fileId: file.id,
      name: file.name,
      uploadUrl,
      storageKey: file.storageKey
    };
  }));
}
// createVersion 
// 1. insert project_version, status.default = 'uploading'
// 2. 准备 versionFile[] 用于一次性插入
// 3. 一次性插入 versionFile[]
// 4. 生成 uploadUrl[] 
export const createVersion = async (projectId: string, reqVersion: CreateVersion, versionFiles: AddVersionFile[], authId: string) => {
  const hasPermission = await checkMemberPermission(projectId, authId, 'upload_version');
  if (!hasPermission) throw AppErr(403, '无权限操作此项目');
  return await db.transaction(async (tx) => {
    // 1. insert project_version
    const newVersion = await tx.insert(projectVersion).values({
      ...reqVersion,
      publisherId: authId
    }).returning({ id: projectVersion.id });
    
    const versionId = newVersion[0].id;
    
    // 2. 准备 versionFile[]
    const fileRecords = mutPrepareVersionFiles(versionFiles, projectId, versionId);
    // 3. 一次性插入 versionFile[]
    await tx.insert(versionFile).values(fileRecords);
    // 4. 生成 uploadUrl[]
    const uploadUrls = await generateUploadUrls(fileRecords);
    
    return {
      versionId: versionId,
      uploadUrls: uploadUrls
    };
});
}

// U
export const updateVersion = async (projectId: string, versionId: string, versionUpdateData: UpdateVersion, fileOperations: FileOperations, authId: string) => {
  const hasPermission = await checkMemberPermission(projectId, authId, 'edit_version');
  if (!hasPermission) throw AppErr(403, '无权限操作此项目');

  return await db.transaction(async (tx) => {
    // 1. 更新版本基本信息
    if (Object.keys(versionUpdateData).length > 0) {
      await tx.update(projectVersion)
        .set(versionUpdateData)
        .where(eq(projectVersion.id, versionId));
    }
    
    // 2. 处理文件操作
    if (fileOperations) {
      // 2.1 删除文件
      if (fileOperations.delete && fileOperations.delete.length > 0) {
        // 验证文件是否属于此版本 (避免误删除其他版本的文件)
        const filesToDelete = await tx.select({ 
          id: versionFile.id, 
          storageKey: versionFile.storageKey 
        }).from(versionFile)
        .where(and(
          eq(versionFile.versionId, versionId),
          // 使用 SQL 的 IN 操作符
          sql`${versionFile.id} = ANY(${fileOperations.delete})`
        ));
        
        if (filesToDelete.length > 0) {
          // 删除数据库记录
          await tx.delete(versionFile)
            .where(and(
              eq(versionFile.versionId, versionId),
              sql`${versionFile.id} = ANY(${fileOperations.delete})`
            ));
          
          // TODO: 删除存储文件（可以异步处理或加入删除队列）
          // for (const file of filesToDelete) {
          //   await deleteStorageFile(file.storageKey);
          // }
        }
      }
      
      // 2.2 更新文件信息
      if (fileOperations.update && fileOperations.update.length > 0) {
        for (const fileUpdate of fileOperations.update) {
          const { fileId, ...updateFields } = fileUpdate;
          
          // 验证文件是否属于此版本
          const existingFile = await tx.select({ id: versionFile.id })
            .from(versionFile)
            .where(and(
              eq(versionFile.id, fileId),
              eq(versionFile.versionId, versionId)
            ))
            .limit(1);
          
          if (existingFile.length === 0) {
            throw new Error(`文件 ${fileId} 不存在或不属于此版本`);
          }
          
          // 注意：为了避免 S3 重命名费用，storageKey 一旦创建就不再修改
          // 只更新文件的显示信息，下载时通过 Content-Disposition 控制文件名
          await tx.update(versionFile)
            .set(updateFields) // 不包含 storageKey 的更新
            .where(eq(versionFile.id, fileId));
        }
      }
      
      // 2.3 新增文件
      if (fileOperations.add && fileOperations.add.length > 0) {
        const fileRecords = mutPrepareVersionFiles(fileOperations.add, projectId, versionId);
        
        // 批量插入新文件记录
        await tx.insert(versionFile).values(fileRecords);
        
        // 4. 生成 uploadUrl[]
        return await generateUploadUrls(fileRecords);
      }
    }
    
  });
}

// D
export const deleteVersion = async (projectId: string, versionId: string, authId: string) => {
  const hasPermission = await checkMemberPermission(projectId, authId, 'delete_version');
  if (!hasPermission) throw AppErr(403, '无权限操作此项目');
  // 删除版本记录
  await db.delete(projectVersion).where(eq(projectVersion.id, versionId));
};