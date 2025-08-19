import { createSubApp } from '@/server/createApp';
import communityMembers from '@/server/apps/community/router/member';

const subApp = createSubApp();

// 挂载社区成员相关路由
subApp.route('/', communityMembers);

export default subApp;
