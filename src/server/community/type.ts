import { z } from "@hono/zod-openapi";
import { UserSelect, UserBase, userBaseSchema } from "../auth/model";
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




// 带邀请者信息的成员详情
export type CommunityMemberWithInviter = {
  member: SelectCommunityMember;
  inviter?: UserBase;
}



