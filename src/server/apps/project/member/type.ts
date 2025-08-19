import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { 
  projectMemberInvite, 
  projectMemberRequest, 
  notification, 
  notificationSettings 
} from '@/server/db/schema';

// === 邀请相关类型 ===
export type ProjectMemberInvite = InferSelectModel<typeof projectMemberInvite>;
export type NewProjectMemberInvite = InferInsertModel<typeof projectMemberInvite>;

export type InviteStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';

export interface CreateInviteParams {
  projectId: string;
  inviterId: string;
  email?: string;
  username?: string;
  message?: string;
  role?: string;
  permissions?: string[];
  expiresIn?: number; // 有效期（小时）
}

export interface InviteWithDetails extends ProjectMemberInvite {
  project?: {
    id: string;
    name: string;
    slug: string;
    icon_url?: string;
  };
  inviter?: {
    id: string;
    username: string;
    email: string;
    imageUrl?: string;
  };
  invitee?: {
    id: string;
    username: string;
    email: string;
    imageUrl?: string;
  };
}

// === 请求相关类型 ===
export type ProjectMemberRequest = InferSelectModel<typeof projectMemberRequest>;
export type NewProjectMemberRequest = InferInsertModel<typeof projectMemberRequest>;

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface CreateRequestParams {
  projectId: string;
  requesterId: string;
  message: string;
  requestedRole?: string;
  requestedPermissions?: string[];
  portfolioUrls?: string[];
  experienceDescription?: string;
}

export interface ReviewRequestParams {
  status: 'approved' | 'rejected';
  reviewMessage?: string;
  finalRole?: string;
  finalPermissions?: string[];
  requestId: string;
  reviewerId: string;
}

export interface RequestWithDetails extends ProjectMemberRequest {
  project?: {
    id: string;
    name: string;
    slug: string;
    icon_url?: string;
    owner_type: string;
    owner_id: string;
  };
  requester?: {
    id: string;
    username: string;
    email: string;
    imageUrl?: string;
  };
  reviewer?: {
    id: string;
    username: string;
    email: string;
    imageUrl?: string;
  };
}

// === 通知相关类型 ===
export type Notification = InferSelectModel<typeof notification>;
export type NewNotification = InferInsertModel<typeof notification>;
export type NotificationSettings = InferSelectModel<typeof notificationSettings>;
export type UpdateNotificationSettings = Partial<Omit<InferInsertModel<typeof notificationSettings>, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type NotificationType = 
  | 'invite_received' | 'invite_accepted' | 'invite_rejected'
  | 'request_received' | 'request_approved' | 'request_rejected'
  | 'project_update' | 'version_published' | 'comment_received'
  | 'comment_liked' | 'project_followed' | 'project_collected';

export type RelatedType = 'project' | 'invite' | 'request' | 'comment' | 'version';

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  relatedId?: string;
  relatedType?: RelatedType;
  relatedUrl?: string;
  isImportant?: boolean;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  metadata?: Record<string, any>;
}

export interface NotificationWithDetails extends Notification {
  sender?: {
    id: string;
    username: string;
    imageUrl?: string;
  };
}

export interface NotificationListResult {
  notifications: NotificationWithDetails[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export interface GetNotificationsParams {
  isRead?: boolean;
  isImportant?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}

// === 角色和权限常量 ===
export const MEMBER_ROLES = {
  OWNER: 'owner',
  MAINTAINER: 'maintainer',
  CONTRIBUTOR: 'contributor',
  MEMBER: 'member',
  VIEWER: 'viewer'
} as const;

export const MEMBER_PERMISSIONS = {
  // 项目管理
  MANAGE_PROJECT: 'manage_project',
  DELETE_PROJECT: 'delete_project',
  
  // 成员管理
  MANAGE_MEMBERS: 'manage_members',
  INVITE_MEMBERS: 'invite_members',
  REMOVE_MEMBERS: 'remove_members',
  
  // 版本管理
  MANAGE_VERSIONS: 'manage_versions',
  UPLOAD_VERSIONS: 'upload_versions',
  DELETE_VERSIONS: 'delete_versions',
  
  // 内容管理
  EDIT_DESCRIPTION: 'edit_description',
  MANAGE_GALLERY: 'manage_gallery',
  MODERATE_COMMENTS: 'moderate_comments',
  
  // 统计和分析
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings'
} as const;

// 角色权限映射
export const ROLE_PERMISSIONS = {
  [MEMBER_ROLES.OWNER]: Object.values(MEMBER_PERMISSIONS),
  [MEMBER_ROLES.MAINTAINER]: [
    MEMBER_PERMISSIONS.MANAGE_PROJECT,
    MEMBER_PERMISSIONS.MANAGE_MEMBERS,
    MEMBER_PERMISSIONS.INVITE_MEMBERS,
    MEMBER_PERMISSIONS.MANAGE_VERSIONS,
    MEMBER_PERMISSIONS.UPLOAD_VERSIONS,
    MEMBER_PERMISSIONS.DELETE_VERSIONS,
    MEMBER_PERMISSIONS.EDIT_DESCRIPTION,
    MEMBER_PERMISSIONS.MANAGE_GALLERY,
    MEMBER_PERMISSIONS.MODERATE_COMMENTS,
    MEMBER_PERMISSIONS.VIEW_ANALYTICS,
  ],
  [MEMBER_ROLES.CONTRIBUTOR]: [
    MEMBER_PERMISSIONS.UPLOAD_VERSIONS,
    MEMBER_PERMISSIONS.EDIT_DESCRIPTION,
    MEMBER_PERMISSIONS.MANAGE_GALLERY,
    MEMBER_PERMISSIONS.VIEW_ANALYTICS,
  ],
  [MEMBER_ROLES.MEMBER]: [
    MEMBER_PERMISSIONS.UPLOAD_VERSIONS,
    MEMBER_PERMISSIONS.VIEW_ANALYTICS,
  ],
  [MEMBER_ROLES.VIEWER]: [
    MEMBER_PERMISSIONS.VIEW_ANALYTICS,
  ],
} as const;
