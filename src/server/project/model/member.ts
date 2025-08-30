import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "../../openapi/schemas/create";
import { userBaseSchema } from "../../auth/model";
import { project, projectMember } from "@/server/admin/db/schema";
import { notificationSelectSchema } from "../../notification/model";
import { projectMemberSelectSchema } from "../../admin/db/service";

export const projectOwnerPermissions = [
  'upload_version', 'delete_version', 'edit_version', 'edit_metadata', 'edit_body',
  'manage_member', 'manage_invite', 'delete_project', 'view_analysis', 'view_revenue'
];
// enum
export type ProjectMemberPermissions = 'upload_version' | 'delete_version' | 'edit_version' | 'edit_metadata' | 'edit_body' |
  'manage_member' | 'manage_invite' | 'delete_project' | 'view_analysis' | 'view_revenue';

  


export const inviteJoinProjectMemberSchema = z.object({
  member: projectMemberSelectSchema,
  notification: notificationSelectSchema,
});

export const projectMemberBaseSchema = z.object({
  id: z.string().openapi({ example: "user123" }),
  entityType: z.string().openapi({ example: "user" }), // user or organization
  entity: userBaseSchema.nullable(), // 可能会为空, 例如 user or organization 突然被删除
  role: z.string().openapi({ example: "owner" }), // owner, member, moderator
});
export type ProjectMemberBase = z.infer<typeof projectMemberBaseSchema>;

export const projectMemberSchema = z.object({
  id: z.string().openapi({ example: "user123" }),
  entityType: z.string().openapi({ example: "user" }),
  entity: userBaseSchema.nullable(), // 可能会为空, 例如 user or organization 突然被删除
  role: z.string().openapi({ example: "owner" }), // owner, member, moderator
  permissions: z.array(z.string()).openapi({ example: ["edit", "delete", "manage_members"] }),
  status: z.string().openapi({ example: "active" }), // active, inactive, pending
  joinMethod: z.string().openapi({ example: "invite" }), // invite, manual_review, system
  createdAt: z.string().openapi({ example: "2024-01-01T00:00:00.000Z" }),
});

// 更新项目成员角色路由
export const updateProjectMemberRoleSchema = z.object({
  role: z.string().optional(),
  permissions: z.array(z.string()).optional()
});