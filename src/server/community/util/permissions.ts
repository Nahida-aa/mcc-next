/**
 * Discord风格的权限系统
 * 使用64位位掩码表示权限
 */

// 权限位定义
export const Permissions = {
  // === 通用权限 ===
  CREATE_INSTANT_INVITE: BigInt(1) << BigInt(0),    // 创建邀请链接
  MANAGE_CHANNELS: BigInt(1) << BigInt(1),          // 管理频道
  MANAGE_COMMUNITY: BigInt(1) << BigInt(2),         // 管理社区
  VIEW_AUDIT_LOG: BigInt(1) << BigInt(3),           // 查看审计日志
  VIEW_COMMUNITY_INSIGHTS: BigInt(1) << BigInt(4),  // 查看社区统计信息
  
  // === 文本权限 ===
  VIEW_CHANNELS: BigInt(1) << BigInt(10),           // 查看频道
  SEND_MESSAGES: BigInt(1) << BigInt(11),           // 发送消息
  SEND_TTS_MESSAGES: BigInt(1) << BigInt(12),       // 发送TTS消息
  MANAGE_MESSAGES: BigInt(1) << BigInt(13),         // 管理消息
  EMBED_LINKS: BigInt(1) << BigInt(14),             // 嵌入链接
  ATTACH_FILES: BigInt(1) << BigInt(15),            // 附加文件
  READ_MESSAGE_HISTORY: BigInt(1) << BigInt(16),    // 读取历史消息
  MENTION_EVERYONE: BigInt(1) << BigInt(17),        // @everyone/@here
  USE_EXTERNAL_EMOJIS: BigInt(1) << BigInt(18),     // 使用外部表情
  ADD_REACTIONS: BigInt(1) << BigInt(19),           // 添加反应
  USE_SLASH_COMMANDS: BigInt(1) << BigInt(20),      // 使用斜线命令
  
  // === 语音权限 ===
  CONNECT: BigInt(1) << BigInt(20),                 // 进入语音
  SPEAK: BigInt(1) << BigInt(21),                   // 在语音中说话
  MUTE_MEMBERS: BigInt(1) << BigInt(22),            // 静音成员
  DEAFEN_MEMBERS: BigInt(1) << BigInt(23),          // 耳聋成员
  MOVE_MEMBERS: BigInt(1) << BigInt(24),            // 移动成员
  USE_VAD: BigInt(1) << BigInt(25),                 // 使用语音活动
  PRIORITY_SPEAKER: BigInt(1) << BigInt(26),        // 优先发言者
  
  // === 管理权限 ===
  MANAGE_NICKNAMES: BigInt(1) << BigInt(27),        // 管理昵称
  MANAGE_ROLES: BigInt(1) << BigInt(28),            // 管理角色
  MANAGE_WEBHOOKS: BigInt(1) << BigInt(29),         // 管理Webhook
  MANAGE_EMOJIS: BigInt(1) << BigInt(30),           // 管理表情
  
  // === 高级权限 ===
  KICK_MEMBERS: BigInt(1) << BigInt(40),            // 踢出成员
  BAN_MEMBERS: BigInt(1) << BigInt(41),             // 封禁成员
  ADMINISTRATOR: BigInt(1) << BigInt(42),           // 管理员（所有权限）
  
  // === 项目特定权限 ===
  MANAGE_PROJECT: BigInt(1) << BigInt(50),          // 管理项目
  UPLOAD_FILES: BigInt(1) << BigInt(51),            // 上传文件
  MANAGE_VERSIONS: BigInt(1) << BigInt(52),         // 管理版本
  REVIEW_SUBMISSIONS: BigInt(1) << BigInt(53),      // 审核提交
  MANAGE_DEPENDENCIES: BigInt(1) << BigInt(54),     // 管理依赖
  VIEW_ANALYTICS: BigInt(1) << BigInt(55),          // 查看分析数据
} as const;

// 权限组合
export const PermissionPresets = {
  // 基础权限
  VIEW_ONLY: Permissions.VIEW_CHANNELS | Permissions.READ_MESSAGE_HISTORY,
  
  // 普通成员
  MEMBER: Permissions.VIEW_CHANNELS | 
          Permissions.SEND_MESSAGES | 
          Permissions.ADD_REACTIONS | 
          Permissions.ATTACH_FILES | 
          Permissions.READ_MESSAGE_HISTORY | 
          Permissions.USE_SLASH_COMMANDS,
  
  // 项目贡献者
  CONTRIBUTOR:  Permissions.VIEW_CHANNELS |
                Permissions.SEND_MESSAGES |
                Permissions.ADD_REACTIONS |
                Permissions.ATTACH_FILES,
  // 项目维护者
  MAINTAINER: Permissions.VIEW_CHANNELS |
              Permissions.SEND_MESSAGES |
              Permissions.ADD_REACTIONS |
              Permissions.ATTACH_FILES |
              Permissions.READ_MESSAGE_HISTORY |
              Permissions.USE_SLASH_COMMANDS |
              Permissions.UPLOAD_FILES |
              Permissions.MANAGE_VERSIONS |
              Permissions.MANAGE_MESSAGES |
              Permissions.MANAGE_CHANNELS |
              Permissions.KICK_MEMBERS |
              Permissions.REVIEW_SUBMISSIONS,
  // 项目所有者
  OWNER: Permissions.ADMINISTRATOR,
  // 默认角色权限
  DEFAULT_ROLE: Permissions.VIEW_CHANNELS | 
                Permissions.SEND_MESSAGES | 
                Permissions.READ_MESSAGE_HISTORY,
} as const;

// 工具函数
export class PermissionUtils {
  /**
   * 检查是否有指定权限
   */
  static hasPermission(userPermissions: bigint, permission: bigint): boolean {
    // 管理员拥有所有权限
    if ((userPermissions & Permissions.ADMINISTRATOR) === Permissions.ADMINISTRATOR) {
      return true;
    }
    return (userPermissions & permission) === permission;
  }
  
  /**
   * 添加权限
   */
  static addPermission(permissions: bigint, permission: bigint): bigint {
    return permissions | permission;
  }
  
  /**
   * 移除权限
   */
  static removePermission(permissions: bigint, permission: bigint): bigint {
    return permissions & ~permission;
  }
  
  /**
   * 切换权限
   */
  static togglePermission(permissions: bigint, permission: bigint): bigint {
    return permissions ^ permission;
  }
  
  /**
   * 获取所有权限列表
   */
  static getPermissionList(permissions: bigint): string[] {
    const permissionList: string[] = [];
    
    for (const [name, value] of Object.entries(Permissions)) {
      if (this.hasPermission(permissions, value)) {
        permissionList.push(name);
      }
    }
    
    return permissionList;
  }
  
  /**
   * 计算频道有效权限（考虑角色权限和频道覆写）
   */
  static calculateChannelPermissions(
    memberPermissions: bigint,
    channelOverwrites: Array<{ allow: string; deny: string; type: 'role' | 'member'; id: string }>,
    userId: string,
    userRoles: string[]
  ): bigint {
    let permissions = memberPermissions;
    
    // 应用角色覆写
    for (const overwrite of channelOverwrites) {
      if (overwrite.type === 'role' && userRoles.includes(overwrite.id)) {
        permissions = permissions & ~BigInt(overwrite.deny); // 移除拒绝的权限
        permissions = permissions | BigInt(overwrite.allow);  // 添加允许的权限
      }
    }
    
    // 应用用户覆写（用户覆写优先级最高）
    for (const overwrite of channelOverwrites) {
      if (overwrite.type === 'member' && overwrite.id === userId) {
        permissions = permissions & ~BigInt(overwrite.deny); // 移除拒绝的权限
        permissions = permissions | BigInt(overwrite.allow);  // 添加允许的权限
      }
    }
    
    return permissions;
  }
}

// 权限名称映射（用于UI显示）
export const PermissionNames: Record<string, string> = {
  CREATE_INSTANT_INVITE: '创建邀请链接',
  MANAGE_CHANNELS: '管理频道',
  MANAGE_COMMUNITY: '管理社区',
  VIEW_AUDIT_LOG: '查看审计日志',
  VIEW_COMMUNITY_INSIGHTS: '查看社区统计',
  
  VIEW_CHANNELS: '查看频道',
  SEND_MESSAGES: '发送消息',
  SEND_TTS_MESSAGES: '发送TTS消息',
  MANAGE_MESSAGES: '管理消息',
  EMBED_LINKS: '嵌入链接',
  ATTACH_FILES: '附加文件',
  READ_MESSAGE_HISTORY: '读取历史消息',
  MENTION_EVERYONE: '提及所有人',
  USE_EXTERNAL_EMOJIS: '使用外部表情',
  ADD_REACTIONS: '添加反应',
  USE_SLASH_COMMANDS: '使用命令',
  
  CONNECT: '连接语音',
  SPEAK: '语音发言',
  MUTE_MEMBERS: '静音成员',
  DEAFEN_MEMBERS: '耳聋成员',
  MOVE_MEMBERS: '移动成员',
  USE_VAD: '语音活动检测',
  PRIORITY_SPEAKER: '优先发言',
  
  MANAGE_NICKNAMES: '管理昵称',
  MANAGE_ROLES: '管理角色',
  MANAGE_WEBHOOKS: '管理Webhook',
  MANAGE_EMOJIS: '管理表情',
  
  KICK_MEMBERS: '踢出成员',
  BAN_MEMBERS: '封禁成员',
  ADMINISTRATOR: '管理员',
  
  MANAGE_PROJECT: '管理项目',
  UPLOAD_FILES: '上传文件',
  MANAGE_VERSIONS: '管理版本',
  REVIEW_SUBMISSIONS: '审核提交',
  MANAGE_DEPENDENCIES: '管理依赖',
  VIEW_ANALYTICS: '查看数据分析',
};
