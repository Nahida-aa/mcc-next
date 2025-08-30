import { createSubApp } from "@/api/create.app";
import { requiredAuthMiddleware } from "../../../auth/middleware";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequest, resWith401 } from "@/server/openapi/helpers/json-content";
import { messageObjectSchema } from "@/server/openapi/schemas/res";
import { db } from "@/server/admin/db";
import { eq, and, like, desc, or, sum } from "drizzle-orm";
import { AppErr } from "@/server/openapi/middlewares/on-error";
import { project, projectMember } from "@/server/admin/db/schema";
import { CreateProject, ListUserSelfProjectQuery, ListUserSelfProject
 } from "../model";
import { projectOwnerPermissions } from "../model/member";
import { insertProject, ProjectSelect } from "../../../admin/db/service";
import { channel, community, communityMember } from "../../../community/table";
import { _createCommunity } from "../../../community/service";


export const createProject = async (data: CreateProject, ownerId: string) => {
  return await db.transaction(async (tx) => {
    // 插入新项目
    const [newProject] = await tx.insert(project).values({
      ...data,
      ownerType: 'user', // 暂时只支持用户创建项目
      ownerId: ownerId,
    }).returning({
      id: project.id,
      slug: project.slug,
      name: project.name,
      status: project.status,
      createdAt: project.createdAt
    });

    // 插入项目成员表，将创建者设为项目所有者
    await tx.insert(projectMember).values({
      projectId: newProject.id,
      entityType: 'user',
      entityId: ownerId,
      role: 'owner',
      permissions: projectOwnerPermissions,
      isOwner: true,
      status: 'active',
      joinMethod: 'system',
    });

    // insert community , 暂时用于提供 一个社区空间
    const newCommunity = await _createCommunity(tx, {
      name: newProject.name,
      summary: data.summary,
      type: 'project',
      entityId: newProject.id,
      ownerId: ownerId,
    });
    // insert community channel TODO:
    await tx.insert(channel).values([{
      communityId: newCommunity.id,
      name: '讨论',
      type: 'forum',
    }, {
      communityId: newCommunity.id,
      name: '攻略',
      type: 'release',
    }])
    return newProject;
  });
}
// R
export const listUserProject = async (userId: string, query: ListUserSelfProjectQuery): Promise<ListUserSelfProject> => {
  const {limit = 10, offset = 0, type, status, visibility, search} = query;
  // 构建查询条件 - 使用 Select API
  const conditions = [eq(project.ownerId, userId)];
  
  if (type) {
    conditions.push(eq(project.type, type));
  }
  if (status) {
    conditions.push(eq(project.status, status));
  }
  if (visibility) {
    conditions.push(eq(project.visibility, visibility));
  }
  if (search) {
    conditions.push(like(project.name, `%${search}%`));
  }
  // 获取项目列表 - 使用 Select API
  const projects = await db
    .select({
      icon: project.icon,
      id: project.id,
      type: project.type,
      slug: project.slug,
      name: project.name,
      status: project.status,
      summary: project.summary,
      categories: project.categories,
      visibility: project.visibility,
      downloadCount: project.downloadCount,
      followCount: project.followCount,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })
    .from(project)
    .where(and(...conditions))
    .orderBy(desc(project.updatedAt))
    .limit(limit).offset(offset);

  return projects;
}

export const getExistingProject = async (slug: string) => {
  // 查找项目 - 使用 Select API
  const existingProject = await db
    .select({id: project.id})
    .from(project)
    .where(eq(project.slug, slug))
    .limit(1);
  
  if (existingProject.length > 0) {
    return existingProject[0];
  }
  
  return null;
}

export const getProjectBaseById = async (id: string) => {
  const [projectItem] = await db
    .select({
      icon: project.icon,
      slug: project.slug,
      name: project.name,
    })
    .from(project)
    .where(eq(project.id, id))
    .limit(1);

  return projectItem;
}

export const getProjectDetail = async (slug: string): Promise<ProjectSelect> => {
  // 查找项目 - 使用 Select API
  const projectDetails = await db
    .select()
    .from(project)
    .where(eq(project.slug, slug))
    .limit(1);
  
  if (projectDetails.length === 0) throw AppErr(404, "项目不存在");
  
  return projectDetails[0];
}


