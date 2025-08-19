import { InsertCommunityMember, JoinMethod, JoinMethodNames, JoinMethodType } from "../type";

// 加入方法的权限要求
export const JoinMethodPermissions: Record<JoinMethodType, {
  requiresApproval: boolean;
  requiresInviter: boolean;
  canBeUsedByPublic: boolean;
  description: string;
}> = {
  [JoinMethod.INVITE]: {
    requiresApproval: false,
    requiresInviter: true,
    canBeUsedByPublic: true,
    description: '需要有效的邀请链接或被现有成员邀请',
  },
  [JoinMethod.MANUAL_REVIEW]: {
    requiresApproval: true,
    requiresInviter: false,
    canBeUsedByPublic: true,
    description: '需要提交申请并等待管理员审批',
  },
  [JoinMethod.DISCOVER]: {
    requiresApproval: false,
    requiresInviter: false,
    canBeUsedByPublic: true,
    description: '用户可以直接加入，无需邀请或人工审批',
  },
  [JoinMethod.SYSTEM]: {
    requiresApproval: false,
    requiresInviter: false,
    canBeUsedByPublic: false,
    description: '系统自动创建，如社区初始化',
  },
};

/**
 * 检查加入方法是否需要邀请者
 */
export function requiresInviter(method: JoinMethodType): boolean {
  return JoinMethodPermissions[method].requiresInviter;
}

/**
 * 检查加入方法是否需要审批
 */
export function requiresApproval(method: JoinMethodType): boolean {
  return JoinMethodPermissions[method].requiresApproval;
}

/**
 * 检查加入方法是否可以被公众使用
 */
export function canBeUsedByPublic(method: JoinMethodType): boolean {
  return JoinMethodPermissions[method].canBeUsedByPublic;
}

/**
 * 获取加入方法的显示信息
 */
export function getDisplayInfo(method: JoinMethodType) {
  return {
    name: JoinMethodNames[method],
    permissions: JoinMethodPermissions[method],
  };
}

/**
 * 验证加入数据的完整性
 */
export function validateJoinData(data: {
  joinMethod: JoinMethodType;
  inviterId: InsertCommunityMember['inviterId'];
  requiresApproval?: boolean;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const permissions = JoinMethodPermissions[data.joinMethod];

  // 检查是否需要邀请者
  if (permissions.requiresInviter && !data.inviterId) {
    errors.push(`加入方式 "${JoinMethodNames[data.joinMethod]}" 需要邀请者`);
  }

  // 检查是否不应该有邀请者
  if (!permissions.requiresInviter && data.inviterId) {
    errors.push(`加入方式 "${JoinMethodNames[data.joinMethod]}" 不应该有邀请者`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}