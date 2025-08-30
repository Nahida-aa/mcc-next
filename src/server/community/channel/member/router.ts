import { canViewChannelMembers, listChannelMember, statsChannelMember, listOnlineChannelMember, searchChannelMembers } from '@/server/community/channel/member/service';
import { createSubApp } from '../../../../api/create.app';
import { createRoute, z } from '@hono/zod-openapi';
import { IdUUIDParamsSchema, reqQuerySearch } from '../../../openapi/schemas/req';
import { jsonContent } from '../../../openapi/helpers/json-content';
import { member } from '@/server/admin/db/schema';
import { ChannelMemberWithPermissions, channelMemberWithPermissionsSchema } from '../../type';
import { messageObjectSchema } from '@/server/openapi/schemas/res';
import { requiredAuthMiddleware } from '@/server/auth/middleware';

const app = createSubApp();
app.use(requiredAuthMiddleware);

const listChannelMembersRoute = createRoute({
  tags: ['channel'], method: 'get', path: '/channels/{id}/members',
  description: '获取频道成员列表',
  request: {
    params: IdUUIDParamsSchema,
    query: reqQuerySearch.extend({
      includeOffline: z.coerce.boolean().optional().default(true),
    }),
  },
  responses: {
    200: jsonContent(z.object({
      channelId: z.string(),
      members: z.array(channelMemberWithPermissionsSchema),
      total: z.number().int().min(0),
    }), "获取频道成员列表成功"),
    401: jsonContent(messageObjectSchema(), "Unauthorized"),
    403: jsonContent(messageObjectSchema(), "没有权限查看此频道成员"),
  }
});
app.openapi(listChannelMembersRoute, async (c) => {
  const { id:channelId } = c.req.valid("param");
  const { includeOffline, limit, search } = c.req.valid("query");
  const currentUserId = c.var.session.user.id;

  // 检查用户是否有权限查看频道成员
  const canView = await canViewChannelMembers(
    channelId, 
    currentUserId
  );

  if (!canView) return c.json({ message: '没有权限查看此频道成员' }, 403);

  let members: ChannelMemberWithPermissions[];

  if (search) {
    // 搜索成员
    members = await searchChannelMembers(
      channelId, 
      search, 
      limit || 20
    );
  } else if (includeOffline) {
    // 获取所有成员（包括离线）
    members = await listChannelMember(channelId);
    if (limit) {
      members = members.slice(0, limit);
    }
  } else {
    // 只获取在线成员
    const onlineMembers = await listOnlineChannelMember(channelId);
    members = onlineMembers.filter(m => m.isOnline);
    if (limit) {
      members = members.slice(0, limit);
    }
  }

  return c.json({
    channelId,
    members,
    total: members.length,
  },200);
});

export default app;
