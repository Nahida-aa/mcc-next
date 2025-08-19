import { db } from '@/server/db';
import { 
  community, 
  communityMember, 
  communityRole 
} from '../table';
import { user } from '../../auth/table';
import { eq, and, desc, inArray, sql, count } from 'drizzle-orm';
import { 
  JoinMethod, 
  JoinMethodType, 
  CommunityMemberWithInviter,
  MemberJoinStats 
} from '../type';
import { UserBase } from '../../auth/model';
import { HttpError } from '../../openapi/middlewares/on-error';
import { requiresApproval, validateJoinData } from '../util/join';
import { InsertCommunityMember } from '../type';

// 检查是否存在成员
export const checkMemberExisting = async (
  communityId: string, 
  userId: string
): Promise<boolean> => {
  const existingMember = await db.select({
    id: communityMember.id,
  })
    .from(communityMember)
    .where(
      and(
        eq(communityMember.communityId, communityId),
        eq(communityMember.userId, userId)
      )
    )
    .limit(1);

  return existingMember.length > 0;
}

type AddMemberParams = Omit<InsertCommunityMember, 'joinMethod'> & {
  joinMethod: JoinMethodType;
}

export const addMember = async(params: AddMemberParams): Promise<CommunityMemberWithInviter> => {
  const { joinMethod, inviterId } = params;

  // 验证加入数据
  const validation = validateJoinData({
    joinMethod,
    inviterId,
  });

  if (!validation.valid) throw new HttpError(422, `加入数据验证失败: ${validation.errors.join(', ')}`);

  // 检查用户是否已经是成员
  const memberExisting = await checkMemberExisting(params.communityId, params.userId);
  if (memberExisting) throw new HttpError(409, '用户已经是社区成员');

  // 添加成员（使用用户指定的状态，不做自动判断）
  const [newMember] = await db.insert(communityMember)
    .values(params)
    .returning();

  // 获取完整的成员信息
  return await getMemberWithInviter(newMember.id);
}

// 用户发现并直接加入社区
export const  discoverAndDirectlyJoin = async(
  communityId: string,
  userId: string,
): Promise<CommunityMemberWithInviter> => {
  return await addMember({
    communityId,
    userId,
    joinMethod: JoinMethod.DISCOVER,
    status: 'active', // 发现加入直接激活
  });
}


/**
 * 用户提交申请加入社区（便捷方法）
 */
export async function submitJoinRequest(
  communityId: string,
  userId: string
): Promise<CommunityMemberWithInviter> {
  return await addMember({
    communityId,
    userId,
    joinMethod: JoinMethod.MANUAL_REVIEW,
    status: 'pending', // 申请状态为待审核
  });
}

export async function getMemberWithInviter(memberId: string): Promise<CommunityMemberWithInviter> {
  
  const [result] = await db.select({
    member: communityMember,
    user: {
      id: user.id,
      username: user.username,
      displayUsername: user.displayUsername,
      image: user.image,
    },
  })
  .from(communityMember)
  .innerJoin(user, eq(communityMember.userId, user.id))
  .where(eq(communityMember.id, memberId))
  .limit(1);

  if (!result) throw new HttpError(404, '成员不存在');

  return result;
}

/**
 * 获取社区成员加入统计
 */
export async function getMemberJoinStats(communityId: string): Promise<MemberJoinStats> {
  // 获取总成员数
  const [totalResult] = await db.select({
    total: count()
  })
  .from(communityMember)
  .where(eq(communityMember.communityId, communityId));

  // 按加入方式统计
  const joinMethodStats = await db.select({
    joinMethod: communityMember.joinMethod,
    count: count()
  })
  .from(communityMember)
  .where(eq(communityMember.communityId, communityId))
  .groupBy(communityMember.joinMethod);

  // 最近7天的加入统计
  const recentJoins = await db.select({
    date: sql<string>`DATE(${communityMember.createdAt})`,
    joinMethod: communityMember.joinMethod,
    count: count()
  })
  .from(communityMember)
  .where(
    and(
      eq(communityMember.communityId, communityId),
      sql`${communityMember.createdAt} >= CURRENT_DATE - INTERVAL '7 days'`
    )
  )
  .groupBy(
    sql`DATE(${communityMember.createdAt})`,
    communityMember.joinMethod
  )
  .orderBy(sql`DATE(${communityMember.createdAt})`);

  // 构建统计结果
  const byJoinMethod: Record<JoinMethodType, number> = {
    [JoinMethod.INVITE]: 0,
    [JoinMethod.MANUAL_REVIEW]: 0,
    [JoinMethod.DISCOVER]: 0,
    [JoinMethod.SYSTEM]: 0,
  };

  joinMethodStats.forEach(stat => {
    byJoinMethod[stat.joinMethod as JoinMethodType] = stat.count;
  });

  return {
    total: totalResult.total,
    byJoinMethod,
    recentJoins: recentJoins.map(join => ({
      date: join.date,
      count: join.count,
      method: join.joinMethod as JoinMethodType,
    })),
  };
}

/**
 * 批准待审核的成员
 */
export async function approvePendingMember(
  communityId: string,
  userId: string,
  approverId: string
): Promise<void> {
  const result = await db.update(communityMember)
    .set({
      status: 'active',
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(communityMember.communityId, communityId),
        eq(communityMember.userId, userId),
        eq(communityMember.status, 'pending')
      )
    )
    .returning();

  if (!result.length) {
    throw new Error('找不到待审核的成员或成员已被处理');
  }

  // TODO: 发送通知给用户
  // await NotificationService.sendMemberApprovedNotification(userId, communityId, approverId);
}

/**
 * 拒绝待审核的成员
 */
export async function rejectPendingMember(
  communityId: string,
  userId: string,
  rejecterId: string,
  reason?: string
): Promise<void> {
  // 删除待审核的成员记录
  const result = await db.delete(communityMember)
    .where(
      and(
        eq(communityMember.communityId, communityId),
        eq(communityMember.userId, userId),
        eq(communityMember.status, 'pending')
      )
    )
    .returning();

  if (!result.length) {
    throw new Error('找不到待审核的成员或成员已被处理');
  }

  // TODO: 发送通知给用户和记录审计日志
  // await NotificationService.sendMemberRejectedNotification(userId, communityId, rejecterId, reason);
  // await AuditService.logMemberAction('reject', communityId, userId, rejecterId, { reason });
}

/**
 * 移除社区成员
 */
export async function removeMember(
  communityId: string,
  userId: string,
  removerId: string,
  reason?: string
): Promise<void> {
  const result = await db.delete(communityMember)
    .where(
      and(
        eq(communityMember.communityId, communityId),
        eq(communityMember.userId, userId)
      )
    )
    .returning();

  if (!result.length) {
    throw new HttpError(404, '成员不存在');
  }

  // TODO: 记录审计日志和发送通知
  // await AuditService.logMemberAction('remove', communityId, userId, removerId, { reason });
}


