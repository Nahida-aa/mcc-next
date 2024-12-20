'server-only';
import { eq, lt, gte, ne, sql, and, or } from 'drizzle-orm';
import { db } from '..';
import { linkUserFollow } from '../schema/link';
import { user as userTable } from '../schema/user';

export async function getUserFollowers(userId: string) {
  const followers = await db
    .select({
      followerId: linkUserFollow.userId,
      follower: userTable,
    })
    .from(linkUserFollow)
    .leftJoin(userTable, eq(linkUserFollow.userId, userTable.id))
    // .innerJoin(user, linkUserFollow.userId.eq(user.id))
    // .where(linkUserFollow.targetUserId.eq(userId))
    .where(eq(linkUserFollow.targetUserId, userId))
    // .all();

  return followers;
}

export class QLinkUserFollow {
  // 返回当目标户关注的用户(团队)list, 每个用户携带与当前用户的关注关系(两个字段: 1. 当前用户是否关注了目标用户的关注的用户; 2. 目标用户关注的用户是否关注了当前用户)
  static async getFollowingByIds(currentUserId: string, targetUserId: string) {
    const subquery = db
      .select({
        followedId: linkUserFollow.targetUserId,
        currentFollowingUser: sql<boolean>`CASE WHEN ${linkUserFollow.userId} = ${currentUserId} THEN true ELSE false END`,
        userFollowingCurrent: sql<boolean>`CASE WHEN ${linkUserFollow.targetUserId} = ${currentUserId} THEN true ELSE false END`,
      })
      .from(linkUserFollow)
      .where(or(
        eq(linkUserFollow.userId, currentUserId),
        eq(linkUserFollow.targetUserId, currentUserId)
      ))
      .as('subquery');

    const result = await db
      .select({
        user: userTable,
        currentFollowingUser: subquery.currentFollowingUser,
        userFollowingCurrent: subquery.userFollowingCurrent,
      })
      .from(linkUserFollow)
      .innerJoin(userTable, eq(linkUserFollow.targetUserId, userTable.id))
      .leftJoin(subquery, eq(subquery.followedId, userTable.id))
      .where(eq(linkUserFollow.userId, targetUserId))
      .orderBy(userTable.name);

    return result.map(row => ({
      ...row.user,
      currentFollowingUser: row.currentFollowingUser ?? false,
      userFollowingCurrent: row.userFollowingCurrent ?? false,
    }));

  }

  static async getByIds(currentUserId: string, targetUserId: string) {
    const [dbLinkUserFollow] = await db.select()
      .from(linkUserFollow)
      .where(
        sql`(${linkUserFollow.userId} = ${currentUserId}) and (${linkUserFollow.targetUserId} = ${targetUserId})`
      )
    return dbLinkUserFollow
  }

  static async create(currentUserId: string, targetUserId: string) {
    const [dbLinkUserFollow] = await db.insert(linkUserFollow)
      .values({
        userId: currentUserId,
        targetUserId,
      })
      .returning()
    return dbLinkUserFollow
  }

  static async followUserByIds(currentUserId: string, targetUserId: string) {//业务逻辑: 当前用户关注目标用户
    // 检查是否已经关注
    const dbLinkUserFollow = await this.getByIds(currentUserId, targetUserId)
    if (dbLinkUserFollow) {
      throw new Error('User is already following the target user');
    }
    
    // 使用事务来确保所有更新都成功完成或全部回滚
    return await db.transaction(async (tx) => {
      console.log('followUserByIds::transaction 开始', currentUserId, targetUserId);
      // 创建关注 link
      const [newLinkUserFollow] = await tx.insert(linkUserFollow)
        .values({
          userId: currentUserId,
          targetUserId,
        })
        .returning();

      // 更新目标用户的粉丝数并返回更新后的用户数据
      const [updatedTargetUser] = await tx.update(userTable)
        .set({
          followersCount: sql`${userTable.followersCount} + 1`,
        })
        .where(eq(userTable.id, targetUserId))
        .returning();

      // 更新当前用户的关注人数并返回更新后的用户数据
      const [updatedCurrentUser] = await tx.update(userTable)
        .set({
          followingCount: sql`${userTable.followingCount} + 1`,
        })
        .where(eq(userTable.id, currentUserId))
        .returning();

      return {
        linkUserFollow: newLinkUserFollow,
        currentUser: updatedCurrentUser,
        targetUser: updatedTargetUser
      };
    });
  }

  static async followUserByNames(currentUserName: string, targetUserName: string) {
    console.log('followUserByNames:', currentUserName, targetUserName);
    const [{id: currentUserId }] = await db.select({id: userTable.id})
      .from(userTable)
      .where(eq(userTable.name, currentUserName))

    const [{id: targetUserId}] = await db.select({id: userTable.id})
      .from(userTable)
      .where(eq(userTable.name, targetUserName))

    if (!currentUserId || !targetUserId) {
      throw new Error('User not found');
    }

    return this.followUserByIds(currentUserId, targetUserId);
  }
}