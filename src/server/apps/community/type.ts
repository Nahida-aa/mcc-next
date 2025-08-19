import { z } from "@hono/zod-openapi";
import { SelectUser, UserBase, userBaseSchema } from "../auth/model";
import { createSelectSchema } from "../openapi/schemas/create";
import { community, communityMember } from "./table";

export type SelectCommunity = typeof community.$inferSelect;
export type SelectCommunityMember = typeof communityMember.$inferSelect;
export type InsertCommunityMember = typeof communityMember.$inferInsert;
export type ChannelMemberInfo = Omit<SelectCommunityMember,"createdAt"|"updatedAt"|'joinMethod'|'inviterId'> & {
  isOnline?: boolean;
  lastActiveAt?: Date;
  user: UserBase
};
export type ChannelMemberWithPermissions =  ChannelMemberInfo & {
  channelPermissions: bigint; // 计算后的频道权限
  canViewChannel: boolean;
  canSendMessages: boolean;
  canManageMessages: boolean;
};
export const channelMemberWithPermissionsSchema = createSelectSchema(communityMember).omit({
  createdAt: true,
  updatedAt: true,
  joinMethod: true,
  inviterId: true,
}).extend({
  isOnline: z.boolean().optional(),
  lastActiveAt: z.date().nullable().optional(),
  channelPermissions: z.bigint(),
  canViewChannel: z.boolean(),
  canSendMessages: z.boolean(),
  canManageMessages: z.boolean(),
  user: userBaseSchema
});

// 加入方法枚举
export const JoinMethod = {
  INVITE: 'invite',       // 通过邀请加入
  MANUAL_REVIEW: 'manual_review', // 通过 人工审核(人工检查\验证) 即 申请 加入
  DISCOVER: 'discover', // 用户自己发现, 且 社区没有设置 人工审核
  SYSTEM: 'system',      // 系统创建（如社区创建者）
} as const;

export type JoinMethodType = typeof JoinMethod[keyof typeof JoinMethod];

// Zod Schema for join method validation
export const JoinMethodSchema = z.enum(['invite', 'request', 'auto', 'direct', 'import', 'system']);

// 加入方法的显示名称
export const JoinMethodNames: Record<JoinMethodType, string> = {
  [JoinMethod.INVITE]: '邀请加入',
  [JoinMethod.MANUAL_REVIEW]: '人工审核',
  [JoinMethod.DISCOVER]: '发现',
  [JoinMethod.SYSTEM]: '系统创建',
};


// 带邀请者信息的成员详情
export type CommunityMemberWithInviter = {
  member: SelectCommunityMember;
  inviter?: UserBase;
}

// 成员统计按加入方式分组
export interface MemberJoinStats {
  total: number;
  byJoinMethod: Record<JoinMethodType, number>;
  recentJoins: Array<{
    date: string;
    count: number;
    method: JoinMethodType;
  }>;
}

// 加入审计日志
export interface JoinAuditLog {
  id: string;
  communityId: string;
  userId: string;
  action: 'join' | 'leave' | 'kicked' | 'banned';
  joinMethod?: JoinMethodType;
  inviterId?: string;
  reason?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}