// import { createSubApp } from '@/server/createApp';
// import { z } from 'zod';
// import { requiredAuthMiddleware } from '../../auth/middleware';
// import { JoinMethodSchema } from '../type';

// const subApp = createSubApp();
// subApp.use(requiredAuthMiddleware);


// // Schema定义
// const addMemberSchema = z.object({
//   communityId: z.string().min(1, '社区ID不能为空'),
//   userId: z.string().min(1, '用户ID不能为空'),
//   joinMethod: JoinMethodSchema,
//   inviterId: z.string().optional(),
//   roles: z.array(z.string()).default([]),
//   permissions: z.string().optional(),
//   nickname: z.string().optional(),
//   status: z.enum(['active', 'pending']).optional(),
// });

// const inviteSchema = z.object({
//   communityId: z.string().min(1, '社区ID不能为空'),
//   userId: z.string().min(1, '用户ID不能为空'),
//   roles: z.array(z.string()).default([]),
// });

// const joinRequestSchema = z.object({
//   communityId: z.string().min(1, '社区ID不能为空'),
// });

// const memberActionSchema = z.object({
//   communityId: z.string().min(1, '社区ID不能为空'),
//   userId: z.string().min(1, '用户ID不能为空'),
//   reason: z.string().optional(),
// });

// /**
//  * POST /community-members
//  * 添加社区成员
//  */
// subApp.post('/community-members', validate(addMemberSchema), async (c) => {
//   try {
//     const data = c.get('validatedData');
//     const currentUser = c.var.session.user;
    
//     const member = await CommunityMemberService.addMember({
//       ...data,
//       permissions: data.permissions ? BigInt(data.permissions) : undefined,
//     });

//     return c.json({
//       success: true,
//       data: member,
//       message: '成员添加成功',
//     });
//   } catch (error) {
//     console.error('添加社区成员失败:', error);
//     const message = error instanceof Error ? error.message : '添加成员失败';
//     return c.json({ message }, 400);
//   }
// });

// /**
//  * POST /community-members/invite
//  * 通过邀请添加成员
//  */
// subApp.post('/community-members/invite', validate(inviteSchema), async (c) => {
//   try {
//     const data = c.get('validatedData');
//     const currentUser = c.var.session.user;

//     const member = await CommunityMemberService.addMemberByInvite(
//       data.communityId,
//       data.userId,
//       currentUser.id,
//       data.roles
//     );

//     return c.json({
//       success: true,
//       data: member,
//       message: '邀请成功',
//     });
//   } catch (error) {
//     console.error('邀请成员失败:', error);
//     const message = error instanceof Error ? error.message : '邀请失败';
//     return c.json({ message }, 400);
//   }
// });

// /**
//  * POST /community-members/request
//  * 申请加入社区
//  */
// subApp.post('/community-members/request', validate(joinRequestSchema), async (c) => {
//   try {
//     const data = c.get('validatedData');
//     const currentUser = c.var.session.user;

//     const member = await CommunityMemberService.addMemberByRequest(
//       data.communityId,
//       currentUser.id
//     );

//     return c.json({
//       success: true,
//       data: member,
//       message: '加入申请提交成功，请等待审核',
//     });
//   } catch (error) {
//     console.error('申请加入失败:', error);
//     const message = error instanceof Error ? error.message : '申请失败';
//     return c.json({ message }, 400);
//   }
// });

// /**
//  * POST /community-members/approve
//  * 批准待审核成员
//  */
// subApp.post('/community-members/approve', validate(memberActionSchema), async (c) => {
//   try {
//     const data = c.get('validatedData');
//     const currentUser = c.var.session.user;

//     await CommunityMemberService.approvePendingMember(
//       data.communityId,
//       data.userId,
//       currentUser.id
//     );

//     return c.json({
//       success: true,
//       message: '成员审核通过',
//     });
//   } catch (error) {
//     console.error('批准成员失败:', error);
//     const message = error instanceof Error ? error.message : '批准失败';
//     return c.json({ message }, 400);
//   }
// });

// /**
//  * POST /community-members/reject  
//  * 拒绝待审核成员
//  */
// subApp.post('/community-members/reject', validate(memberActionSchema), async (c) => {
//   try {
//     const data = c.get('validatedData');
//     const currentUser = c.var.session.user;

//     await CommunityMemberService.rejectPendingMember(
//       data.communityId,
//       data.userId,
//       currentUser.id,
//       data.reason
//     );

//     return c.json({
//       success: true,
//       message: '已拒绝该成员的加入申请',
//     });
//   } catch (error) {
//     console.error('拒绝成员失败:', error);
//     const message = error instanceof Error ? error.message : '拒绝失败';
//     return c.json({ message }, 400);
//   }
// });

// /**
//  * DELETE /community-members/:communityId/:userId
//  * 移除社区成员
//  */
// subApp.delete('/community-members/:communityId/:userId', async (c) => {
//   try {
//     const communityId = c.req.param('communityId');
//     const userId = c.req.param('userId');
//     const reason = c.req.query('reason');
//     const currentUser = c.var.session.user;

//     await CommunityMemberService.removeMember(
//       communityId,
//       userId,
//       currentUser.id,
//       reason
//     );

//     return c.json({
//       success: true,
//       message: '成员移除成功',
//     });
//   } catch (error) {
//     console.error('移除成员失败:', error);
//     const message = error instanceof Error ? error.message : '移除失败';
//     return c.json({ message }, 400);
//   }
// });

// /**
//  * GET /community-members/:communityId/stats
//  * 获取社区成员加入统计
//  */
// subApp.get('/community-members/:communityId/stats', async (c) => {
//   try {
//     const communityId = c.req.param('communityId');
    
//     const stats = await CommunityMemberService.getMemberJoinStats(communityId);

//     return c.json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     console.error('获取成员统计失败:', error);
//     const message = error instanceof Error ? error.message : '获取统计失败';
//     return c.json({ message }, 500);
//   }
// });

// /**
//  * GET /community-members/:communityId/history
//  * 获取成员加入历史
//  */
// subApp.get('/community-members/:communityId/history', async (c) => {
//   try {
//     const communityId = c.req.param('communityId');
//     const limit = parseInt(c.req.query('limit') || '50');
//     const offset = parseInt(c.req.query('offset') || '0');

//     const history = await CommunityMemberService.getMemberJoinHistory(
//       communityId,
//       limit,
//       offset
//     );

//     return c.json({
//       success: true,
//       data: history,
//       pagination: {
//         limit,
//         offset,
//         hasMore: history.length === limit,
//       },
//     });
//   } catch (error) {
//     console.error('获取加入历史失败:', error);
//     const message = error instanceof Error ? error.message : '获取历史失败';
//     return c.json({ message }, 500);
//   }
// });

// /**
//  * GET /community-members/:memberId/details
//  * 获取带邀请者信息的成员详情
//  */
// subApp.get('/community-members/:memberId/details', async (c) => {
//   try {
//     const memberId = c.req.param('memberId');
    
//     const member = await CommunityMemberService.getMemberWithInviter(memberId);

//     return c.json({
//       success: true,
//       data: member,
//     });
//   } catch (error) {
//     console.error('获取成员详情失败:', error);
//     const message = error instanceof Error ? error.message : '获取成员详情失败';
//     return c.json({ message }, 404);
//   }
// });

// export default subApp;
