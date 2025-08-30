import { z } from "@hono/zod-openapi";
import { createInsertSchema } from "../../openapi/schemas/create";
import { community, communityMember } from "../table";

// 加入方法枚举
export const joinMethod = {
  INVITE: 'invite',       // 通过邀请加入
  MANUAL_REVIEW: 'manual_review', // 通过 人工审核(人工检查\验证) 即 申请 加入
  DISCOVER: 'discover', // 用户自己发现, 且 社区没有设置 人工审核
  SYSTEM: 'system',      // 系统创建（如社区创建者）
} as const;

export type JoinMethodType = typeof joinMethod[keyof typeof joinMethod];

// Zod Schema for join method validation
export const JoinMethodSchema = z.enum(['invite', 'request', 'auto', 'direct', 'import', 'system']);

// 加入方法的显示名称
export const JoinMethodNames: Record<JoinMethodType, string> = {
  [joinMethod.INVITE]: '邀请加入',
  [joinMethod.MANUAL_REVIEW]: '人工审核',
  [joinMethod.DISCOVER]: '发现',
  [joinMethod.SYSTEM]: '系统创建',
};

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