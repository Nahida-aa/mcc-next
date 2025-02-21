import { eq, and, ilike, inArray, exists } from "drizzle-orm";
import { db } from "../..";
import { proj_table, projectLinkTag_table } from "../../schema/proj";

type ProjectListParams = {
  type: string;
  limit?: number;
  offset?: number;
  sort?: string; // relevance, download_count, follow_count, published_at, updated_at
  query?: string;
  tags?: string[];
  game_versions?: string[]
  loaders?: string[];
  environment?: string; // client, server, both
  is_open_source?: boolean;
};
export const projectList = async (params: ProjectListParams) => {
  const { type, limit=20, offset=0, sort = "relevance", query, tags, game_versions, loaders, environment, is_open_source } = params;

  let whereConditions = [
    eq(proj_table.type, type),
    query ? ilike(proj_table.name, `%${query}%`) : undefined,
    environment ? eq(proj_table.environment, environment) : undefined,
    is_open_source !== undefined ? eq(proj_table.is_open_source, is_open_source) : undefined,
  ];

  if (tags && tags.length > 0) {
    whereConditions.push(
      exists(
        db.select()
          .from(projectLinkTag_table)
          .where(
            and(
              eq(projectLinkTag_table.project_id, proj_table.id),
              inArray(projectLinkTag_table.tag, tags)
            )
          )
      )
    );
  }

  let queryBuilder = db
    .select()
    .from(proj_table)
    .where(and(...whereConditions.filter(Boolean)));

  const count = (await queryBuilder).length
  const projects = await queryBuilder.limit(limit).offset(offset)
  return { count, data: projects }
}