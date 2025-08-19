import {user, account, organization, invitation, member, session,twoFactor, verification} from "../apps/auth/table";
import {follow, friend} from "../apps/follow/follow-schema";
import {
  project,
  projectVersion,
  versionFile,
  projectDependency,
  projectMember,
  projectFollow,
  projectCollection,
  projectComment,
  projectRating,
  projectDownload,
} from "../apps/project/table";
// notification
import {notification,notificationReceiver, notificationSettings } from "../apps/notification/table";
import {
  fileStorage,
  fileUsage,
  fileShare,
  fileAccessLog,
  fileTag,
  fileTagRelation
} from "../apps/upload/file-schema";

// 不要改成默认导出, 由于我们模仿 django 的代码组织形式, 将 table 定义在了 各个模块中, 而 drizzle.config.ts 需要指定一个文件或文件夹
export {
  // 认证相关
  user,
  account,
  organization,
  invitation,
  member,
  session,
  twoFactor,
  verification,
  follow,
  friend,
  
  // 项目相关
  project,
  projectVersion,
  versionFile,
  projectDependency,
  projectMember,
  projectFollow,
  projectCollection,
  projectComment,
  projectRating,
  projectDownload,
  
  // notification
  notification,
  notificationReceiver,
  notificationSettings,
  
  // 文件相关
  fileStorage,
  fileUsage,
  fileShare,
  fileAccessLog,
  fileTag,
  fileTagRelation
}