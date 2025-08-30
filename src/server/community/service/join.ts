import { db } from "../../admin/db";
import { joinMethod } from "../model/member";
import { CommunityMemberWithInviter } from "../type";
import { addMember } from "./member";

// 
/**
 *用户sendInvitation 邀请其他用户加入社区, 需要 被邀请用户 的 id
 */
export const sendInvitation = async (
  communityId: string,
  inviterId: string,
  targetUserId: string,
) => {
}

/**
 *用户接受邀请加入社区
 *- 注意：这个函数假设邀请已经存在并且有效
 */
export const acceptInviteAndJoin = async (
  communityId: string,
  userId: string,
  inviterId: string,
) => {
  // TODO: 这里应该验证邀请是否存在且有效
  // const invitation = await getValidInvitation(communityId, userId, inviteCode);
  // if (!invitation) throw new HttpError(404, '邀请不存在或已过期');
  
  return await addMember(db, {
    communityId,
    userId,
    joinMethod: joinMethod.INVITE,
    inviterId,
    status: 'active', // 接受邀请直接激活
  });
}