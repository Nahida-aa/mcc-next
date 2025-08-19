import { createSubApp } from "@/server/createApp";
import { requiredAuthMiddleware } from "../../auth/middleware";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequest, resWith401 } from "@/server/apps/openapi/helpers/json-content";
import { messageObjectSchema } from "@/server/apps/openapi/schemas/res";
import { db } from "@/server/db";
import { user, organization } from "@/server/apps/auth/table";
import { eq, and, like, desc, InferSelectModel, or } from "drizzle-orm";
import { AppError, HTTPResponseError } from "@/server/apps/openapi/middlewares/on-error";
import { project, projectMember } from "@/server/db/schema";
import { CreateProjectSchema } from "../model";

export const projectOwnerPermissions = [
  'upload_version', 'delete_version', 'edit_metadata', 'edit_body',
  'manage_member', 'manage_invite', 'delete_project', 'view_analysis', 'view_revenue'
];

export const createProject = async (data: CreateProjectSchema, ownerId: string) => {
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

    return newProject;
  });
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

// 从 drizzle-orm 推断 类型
export type ProjectDetail = InferSelectModel<typeof project>; // SELECT 出来的类型
// type ProjectDetail =
export const getProjectDetail = async (slug: string): Promise<ProjectDetail> => {
  // 查找项目 - 使用 Select API
  const projectDetails = await db
    .select()
    .from(project)
    .where(eq(project.slug, slug))
    .limit(1);
  
  if (projectDetails.length === 0) throw new AppError(404, "项目不存在");
  
  return projectDetails[0];
}


// 获取特定类型的项目成员（仅用户或仅组织）
export const listProjectMembersByType = async (slug: string, entityType: 'user' | 'organization') => {
  const existingProject = await getExistingProject(slug);
  if (!existingProject) throw new AppError(404, "项目不存在");

  if (entityType === 'user') {
    return await db
      .select({
        id: user.id,
        entityType: projectMember.entityType,
        name: user.name,
        username: user.username,
        image: user.image,
        role: projectMember.role,
        permissions: projectMember.permissions,
        status: projectMember.status,
        joinMethod: projectMember.joinMethod,
        createdAt: projectMember.createdAt,
      })
      .from(projectMember)
      .innerJoin(user, eq(projectMember.entityId, user.id))
      .where(
        and(
          eq(projectMember.projectId, existingProject.id),
          eq(projectMember.entityType, 'user'),
          eq(projectMember.status, 'active') // 仅返回活跃成员
        )
      )
      .orderBy(projectMember.createdAt);
  } else {
    return await db
      .select({
        id: organization.id,
        entityType: projectMember.entityType,
        name: organization.name,
        username: organization.slug,
        image: organization.logo,
        role: projectMember.role,
        permissions: projectMember.permissions,
        status: projectMember.status,
        joinMethod: projectMember.joinMethod,
        createdAt: projectMember.createdAt,
      })
      .from(projectMember)
      .innerJoin(organization, eq(projectMember.entityId, organization.id))
      .where(
        and(
          eq(projectMember.projectId, existingProject.id),
          eq(projectMember.entityType, 'organization'),
          eq(projectMember.status, 'active') // 仅返回活跃成员
        )
      )
      .orderBy(projectMember.createdAt);
  }
}

// 检查用户是否为项目成员
export const isProjectMember = async (projectId: string, userId: string): Promise<boolean> => {
  const member = await db
    .select({ id: projectMember.id })
    .from(projectMember)
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(projectMember.entityType, 'user'),
        eq(projectMember.entityId, userId),
        eq(projectMember.status, 'active')
      )
    )
    .limit(1);
  
  return member.length > 0;
}

