import { createInsertSchema, createSelectSchema, createUpdateSchema } from "@/server/openapi/schemas/create";
import { Db } from "."
import { project, projectMember, community, communityMember, channelMessage, userReadState } from "./schema"
import { eq, and, desc, sql, SQL } from "drizzle-orm";
import { z } from "zod/v4";

export const projectSelectSchema = createSelectSchema(project);
export type ProjectSelect = typeof project.$inferSelect;
// 可见 selectProject 相对麻烦, 因此我们 不先不编写 selectProject, 而是 利用 sql gui客户端直接 查看列表, 而对于插入 来说 使用 sql gui客户端 容易误操作,
export const selectProject = async (
  db: Db,
  options?: {
    ownerId?: string;
    visibility?: string; // public | unlisted | private
    status?: string;     // draft | approved | archived ...
    search?: string;     // 按 name/summary 模糊搜索
    limit?: number;
    offset?: number;
    orderBy?: "publishedAt" | "downloadCount" | "followCount" | "viewCount";
    orderDir?: "asc" | "desc";
  }
) => {
  const {
    ownerId,
    visibility,
    status,
    search,
    limit = 20,
    offset = 0,
    orderBy = "publishedAt",
    orderDir = "desc",
  } = options ?? {};

  const conditions: SQL<unknown>[] = [];

  if (ownerId) {
    conditions.push(eq(project.ownerId, ownerId));
  }
  if (visibility) {
    conditions.push(eq(project.visibility, visibility));
  }
  if (status) {
    conditions.push(eq(project.status, status));
  }
  if (search) {
    // PostgreSQL: 使用 ILIKE 实现模糊搜索
    conditions.push(
      sql`${project.name} ILIKE ${"%" + search + "%"} OR ${project.summary} ILIKE ${"%" + search + "%"}`
    );
  }

  return await db
    .select()
    .from(project)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderDir === "asc" ? project[orderBy] : desc(project[orderBy]))
    .limit(limit)
    .offset(offset);
};
export const projectInsertSchema = createInsertSchema(project);
export type ProjectInsert = typeof project.$inferInsert;
export const projectUpdateSchema = createUpdateSchema(project);
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export const insertProject = async (db: Db, data: ProjectInsert) =>  await db.insert(project).values(data).returning();

export const projectMemberInsertSchema = createInsertSchema(projectMember)
export type ProjectMemberInsert = typeof projectMember.$inferInsert
export const projectMemberSelectSchema = createSelectSchema(projectMember)
export type ProjectMemberSelect = typeof projectMember.$inferSelect
export const projectMemberUpdateSchema = createUpdateSchema(projectMember)
// 从 zod schema 提取类型
// export type ProjectMemberUpdate = 
export const insertProjectMember = async (db: Db, data: ProjectMemberInsert) => await db.insert(projectMember).values(data).returning()

export const communityInsertSchema = createInsertSchema(community);
export type CommunityInsert = typeof community.$inferInsert;
export const communitySelectSchema = createInsertSchema(community);
export type CommunitySelect = typeof community.$inferSelect;
export const communityUpdateSchema = createUpdateSchema(community);
export const insertCommunity = async (db: Db, data: CommunityInsert) => await db.insert(community).values(data).returning()

export const communityMemberInsertSchema = createInsertSchema(communityMember)
export type CommunityMemberInsert = typeof communityMember.$inferInsert;
export const communityMemberSelectSchema = createSelectSchema(communityMember)
export type CommunityMemberSelect = typeof communityMember.$inferSelect;
export const communityMemberUpdateSchema = createUpdateSchema(communityMember)
export const insertCommunityMember = async (db: Db, data: CommunityMemberInsert) => await db.insert(communityMember).values(data).returning()

export const channelMessageInsertSchema = createInsertSchema(channelMessage);
export type ChannelMessageInsert = typeof channelMessage.$inferInsert;
export const channelMessageSelectSchema = createSelectSchema(channelMessage);
export type ChannelMessageSelect = typeof channelMessage.$inferSelect;
export const channelMessageUpdateSchema = createUpdateSchema(channelMessage);