import { db } from "@/server/admin/db";
import { notification, notificationReceiver, organization, projectMember, user } from "@/server/admin/db/schema";
import { eq, and, lt, gte, ne, asc, desc, or, isNotNull, not, inArray, notInArray, is } from 'drizzle-orm';
import { getExistingProject } from ".";
import { ProjectMemberPermissions } from "../model/member";
import { HTTPException } from "hono/http-exception";
import { AppErr } from "../../openapi/middlewares/on-error";
import { notificationType } from "../../notification/model";

// 这里是 projectMember 并非 communityMember

// joinMethod: 系统创建, 邀请, 人工审核
// 系统创建: 不需要专门实现

// 获取用户在项目中的角色和权限
export const getUserProjectPermissions = async (projectId: string, userId: string) => {
  console.log("Fetching user project permissions for:", { projectId, userId });
  const member = await db
    .select({
      role: projectMember.role,
      permissions: projectMember.permissions,
      status: projectMember.status,
      isOwner: projectMember.isOwner
    })
    .from(projectMember)
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(projectMember.entityType, 'user'),
        eq(projectMember.entityId, userId)
      )
    )
    .limit(1);

  if (member.length === 0) throw AppErr(404,"项目不存在");
  
  return member[0];
}
// 检查权限的辅助函数
export const checkMemberPermission = async (
  projectId: string,
  userId: string,
  requiredPermission: ProjectMemberPermissions
): Promise<boolean> => {
  const user = await getUserProjectPermissions(projectId, userId);
  console.log("User Permissions:", user);
  return user.isOwner || user?.permissions.includes(requiredPermission) || false;
};

// 邀请用户加入 projectMember 流程:
// 1. invitationJoinProjectMember(inviterId, projectId, targetUserId)
export const inviteJoinProjectMember = async (
  inviterId: string,
  projectId: string,
  targetUserId: string,
) => {
  const memberExisting = await getExistingProjectMember(projectId, 'user', targetUserId);
  if (memberExisting) throw AppErr(400, '用户已是项目成员');

  // 检查权限
  const hasPermission = await checkMemberPermission(projectId, inviterId, 'manage_invite');
  if (!hasPermission) throw AppErr(403, "权限不足：需要`管理邀请`权限");
  return await db.transaction(async (tx) => {
    // 1. 插入 projectMember
    const [newMember] = await tx
      .insert(projectMember)
      .values({
        projectId: projectId,
        entityType: 'user',
        entityId: targetUserId,
        status: 'pending', // 待接受邀请
        inviterId: inviterId,
      })
      .returning();
    // 2. 插入 notification
    const [newNotification] = await tx
      .insert(notification)
      .values({
        type: notificationType.invite_project_member,
        senderId: inviterId,
        content: {
          projectId,
        },
      })
      .returning();
    // 3. 插入 notification_receiver
    await tx
      .insert(notificationReceiver)
      .values({
        notificationId: newNotification.id,
        userId: targetUserId,
        isRead: false,
      });
    return {
      member: newMember,
      notification: newNotification,
    };
  });
};
// 2. listNotification(userId) in src/server/apps/notification/service.ts
// 3. acceptInviteJoinProjectMember(projectId, userId, notificationId)
export const acceptProjectMemberInvite = async (
  projectId: string,
  userId: string,
  notificationId: string,
) => {
  return await db.transaction(async (tx) => {
    // 1. 更新 projectMember.status = active
    const [updatedMember] = await tx
      .update(projectMember)
      .set({ 
        status: 'active',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(projectMember.projectId, projectId),
          eq(projectMember.entityType, 'user'),
          eq(projectMember.entityId, userId),
          eq(projectMember.status, 'pending')
        )
      )
      .returning();
    if (!updatedMember) throw AppErr(404, '邀请已删除');
    // 2. 标记通知为已读
    await tx
      .update(notificationReceiver)
      .set({ 
        isRead: true, 
        readAt: new Date() 
      })
      .where(
        and(
          eq(notificationReceiver.notificationId, notificationId),
          eq(notificationReceiver.userId, userId)
        )
      );
    return updatedMember
  })
};
// 4. rejectProjectMemberInvite
export const rejectProjectMemberInvite = async (
  projectId: string,
  userId: string,
  notificationId: string,
) => {}

// R
export const getExistingProjectMember = async (projectId: string, entityType:string, entityId: string) => {
  const [member] = await db
    .select({
      id: projectMember.id,
      isOwner: projectMember.isOwner,
    }).from(projectMember)
    .where(and(eq(projectMember.projectId, projectId),eq(projectMember.entityType, entityType),eq(projectMember.entityId, entityId)))
    .limit(1);

  return member
};

// 使用左连接一次性获取所有成员
export const listProjectMember = async (projectId: string) => {
  // 使用左连接，但过滤掉实体不存在的记录
  const members = await db
    .select({
      id: projectMember.id,
      entityType: projectMember.entityType,
      entity: {
        id: user.id || organization.id,
        username: user.username || organization.slug,
        displayUsername: user.displayUsername || organization.name,
        image: user.image || organization.logo,
      },
      role: projectMember.role,
      permissions: projectMember.permissions,
      status: projectMember.status,
      joinMethod: projectMember.joinMethod,
      createdAt: projectMember.createdAt,
    })
    .from(projectMember)
    .leftJoin(user, and(
      eq(projectMember.entityId, user.id),
      eq(projectMember.entityType, 'user')
    ))
    .leftJoin(organization, and(
      eq(projectMember.entityId, organization.id),
      eq(projectMember.entityType, 'organization')
    ))
    .where(
      and(
        eq(projectMember.projectId, projectId),
        // 确保实体存在：用户类型成员必须能找到对应用户，组织类型成员必须能找到对应组织
        or(
          and(eq(projectMember.entityType, 'user'), isNotNull(user.id)),
          and(eq(projectMember.entityType, 'organization'), isNotNull(organization.id))
        )
      )
    )
    .orderBy(projectMember.createdAt);

  return members;
}

// 清理无效的项目成员记录（引用了已删除的用户或组织）
export const cleanupInvalidProjectMembers = async () => {
  return await db.transaction(async (tx) => {
    // 删除引用不存在用户的成员记录
    const deletedUserMembers = await tx
      .delete(projectMember)
      .where(and(
        eq(projectMember.entityType, 'user'),
        notInArray(projectMember.entityId, tx.select({ id: user.id }).from(user))
      ))
      .returning({ id: projectMember.id });

    // 删除引用不存在组织的成员记录  
    const deletedOrgMembers = await tx
      .delete(projectMember)
      .where(
        and(
          eq(projectMember.entityType, 'organization'),
          // 使用 not + inArray 实现 notIn 功能
          notInArray(
            projectMember.entityId,
            tx.select({ id: organization.id }).from(organization)
          )
        )
      )
      .returning({ id: projectMember.id });

    return {
      deletedUserMembers: deletedUserMembers.length,
      deletedOrgMembers: deletedOrgMembers.length,
      total: deletedUserMembers.length + deletedOrgMembers.length
    };
  });
};

// listProjectMemberBase Not pending
export const listProjectMemberBase = async (projectId: string) => {
  // 查询项目成员 - 使用 Select API with JOIN
  const members = await db
    .select({
      id: projectMember.id,
      entityType: projectMember.entityType,
      entity: {
        id: user.id || organization.id,
        username: user.username || organization.slug,
        displayUsername: user.displayUsername || organization.name,
        image: user.image || organization.logo,
      },
      role: projectMember.role,
    }).from(projectMember)
    .leftJoin(user, and(
      eq(projectMember.entityId, user.id),
      eq(projectMember.entityType, 'user')
    ))
    .leftJoin(organization, and(
      eq(projectMember.entityId, organization.id),
      eq(projectMember.entityType, 'organization')
    ))
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(projectMember.status, 'active'), // 只获取已激活的成员
        // 确保实体存在：用户类型成员必须能找到对应用户，组织类型成员必须能找到对应组织
        or(
          and(eq(projectMember.entityType, 'user'), isNotNull(user.id)),
          and(eq(projectMember.entityType, 'organization'), isNotNull(organization.id))
        )
      )
    )
    .orderBy(projectMember.createdAt);

  return members;
}

// U
export const updateProjectMember = async (
  projectId: string,
  entityType: 'user' | 'organization',
  entityId: string,
  newData: {
    role?: string,
    permissions?: string[]
  },
  authId: string
) => {
  // 检查成员是否存在
  const existingMember = await getExistingProjectMember(projectId, entityType, entityId);
  if (!existingMember) throw AppErr(404, "成员不存在");
  // 检查权限
  const hasPermission = await checkMemberPermission(projectId, authId,'manage_member');
  if (!hasPermission||(existingMember.isOwner && (authId!==entityId))) throw AppErr(403, "权限不足");
  // 更新成员
  const [updatedMember] = await db.update(projectMember).set(newData)
    .where(and(
      eq(projectMember.projectId, projectId),
      eq(projectMember.entityType, entityType),
      eq(projectMember.entityId, entityId)
    )).returning();

  return updatedMember;
};

// 移除项目成员
export const removeProjectMember = async (
  projectId: string,
  entityType: 'user' | 'organization',
  entityId: string,
  authId: string
) => {
  // 检查权限
  const hasPermission = await checkMemberPermission(projectId, authId,'manage_member');
  if (!hasPermission) throw AppErr(403, "权限不足：需要成员管理权限");

  // 检查成员是否存在
  const existingMember = await db
    .select({ 
      id: projectMember.id,
      isOwner: projectMember.isOwner,
    })
    .from(projectMember)
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(projectMember.entityType, entityType),
        eq(projectMember.entityId, entityId)
      )
    )
    .limit(1);

  if (existingMember.length === 0) throw AppErr(404, "成员不存在");

  // 不能移除项目所有者
  if (existingMember[0].isOwner) throw AppErr(403, "不能移除项目所有者");

  // 删除成员
  await db
    .delete(projectMember)
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(projectMember.entityType, entityType),
        eq(projectMember.entityId, entityId)
      )
    );

  return { success: true };
};