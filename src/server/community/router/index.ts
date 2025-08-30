import { createSubApp } from '@/api/create.app';
// import communityMembers from '@/server/apps/community/router/member';

const app = createSubApp();

// 挂载社区成员相关路由
// .route('/member', communityMembers)

export default app;
