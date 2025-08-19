/**
 * 项目成员查询使用示例
 * 这个文件展示了如何使用支持用户和组织的项目成员查询功能
 */

import { 
  listProjectMember, 
  listProjectMemberEfficient, 
  listProjectMembersByType,
  isProjectMember,
  getUserProjectRole 
} from "../service";

// 示例1: 获取项目所有成员（用户 + 组织）
export async function exampleGetAllMembers() {
  try {
    const projectSlug = "my-awesome-mod";
    
    // 方法1: 分别查询用户和组织成员，然后合并
    const allMembers = await listProjectMember(projectSlug);
    
    // 方法2: 使用左连接一次性查询（更高效）
    const allMembersEfficient = await listProjectMemberEfficient(projectSlug);
    
    console.log("所有项目成员:", allMembers);
    
    // 处理不同类型的成员
    allMembers.forEach(member => {
      if (member.entityType === 'user') {
        console.log(`用户成员: ${member.name} (@${member.username}), 角色: ${member.role}`);
      } else if (member.entityType === 'organization') {
        console.log(`组织成员: ${member.name} (${member.username}), 角色: ${member.role}`);
      }
    });
    
  } catch (error) {
    console.error("获取项目成员失败:", error);
  }
}

// 示例2: 仅获取用户成员
export async function exampleGetUserMembers() {
  try {
    const projectSlug = "my-awesome-mod";
    const userMembers = await listProjectMembersByType(projectSlug, 'user');
    
    console.log("用户成员列表:");
    userMembers.forEach(member => {
      console.log(`- ${member.name} (@${member.username}): ${member.role}`);
      console.log(`  权限: ${member.permissions.join(', ')}`);
      console.log(`  状态: ${member.status}, 加入方式: ${member.joinMethod}`);
    });
    
  } catch (error) {
    console.error("获取用户成员失败:", error);
  }
}

// 示例3: 仅获取组织成员
export async function exampleGetOrganizationMembers() {
  try {
    const projectSlug = "my-awesome-mod";
    const orgMembers = await listProjectMembersByType(projectSlug, 'organization');
    
    console.log("组织成员列表:");
    orgMembers.forEach(member => {
      console.log(`- ${member.name} (${member.username}): ${member.role}`);
      console.log(`  权限: ${member.permissions.join(', ')}`);
    });
    
  } catch (error) {
    console.error("获取组织成员失败:", error);
  }
}

// 示例4: 检查用户权限
export async function exampleCheckUserPermissions() {
  try {
    const projectId = "project-uuid-123";
    const userId = "user-id-456";
    
    // 检查用户是否为项目成员
    const isMember = await isProjectMember(projectId, userId);
    console.log(`用户是否为项目成员: ${isMember}`);
    
    if (isMember) {
      // 获取用户角色和权限
      const userRole = await getUserProjectRole(projectId, userId);
      if (userRole) {
        console.log(`用户角色: ${userRole.role}`);
        console.log(`用户权限: ${userRole.permissions.join(', ')}`);
        console.log(`用户状态: ${userRole.status}`);
        
        // 检查特定权限
        if (userRole.permissions.includes('manage_members')) {
          console.log("用户可以管理项目成员");
        }
        
        if (userRole.permissions.includes('manage_versions')) {
          console.log("用户可以管理项目版本");
        }
      }
    }
    
  } catch (error) {
    console.error("检查用户权限失败:", error);
  }
}

// 示例5: 权限检查辅助函数
export function hasPermission(member: { permissions: string[] }, permission: string): boolean {
  return member.permissions.includes(permission);
}

export function canManageMembers(member: { permissions: string[] }): boolean {
  return hasPermission(member, 'manage_members');
}

export function canManageVersions(member: { permissions: string[] }): boolean {
  return hasPermission(member, 'manage_versions');
}

export function isOwnerOrMaintainer(member: { role: string }): boolean {
  return ['owner', 'maintainer'].includes(member.role);
}

// 示例6: 在API路由中使用
export async function exampleApiUsage() {
  // 在 Hono 路由中的使用示例
  /*
  app.openapi(someRoute, async (c) => {
    const { slug } = c.req.valid('param');
    const session = c.var.session;
    
    // 获取项目成员列表
    const members = await listProjectMember(slug);
    
    // 检查当前用户权限
    const userRole = await getUserProjectRole(projectId, session.user.id);
    if (!userRole || !canManageMembers(userRole)) {
      throw new HttpError(403, "权限不足");
    }
    
    // 返回结果
    return c.json({
      members,
      currentUserRole: userRole
    });
  });
  */
}
