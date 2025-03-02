import { db } from "~/lib/db";
import { proj_table, projectRelease_table, releaseFile_table } from "~/lib/db/schema/proj";
import { eq, and, ilike, inArray, exists, sql } from "drizzle-orm";

type CreateDBProjectReleaseInput = {
  id: string;
  name: string;
  project_id: string;
  creator_id: string;
  version_number: string;
  type: string; // release, beta, alpha
  description?: string;
  loaders: string[]; // files 的 聚合
  game_versions: string[]; // 聚合
  files: {
    filename: string
    pathname: string
    size: number
    type: string
    loaders: string[]
    game_versions: string[]
  }[]
}

export const createDBProjectRelease = async (input: CreateDBProjectReleaseInput) => {
  return await db.transaction(async (tx) => {
    // 1. Create ProjectRelease
    await tx.insert(projectRelease_table).values({
      id: input.id,
      name: input.name,
      proj_id: input.project_id,
      creator_id: input.creator_id,
      version_number: input.version_number,
      game_versions: input.game_versions,
      type: input.type,
      description: input.description,
      loaders: input.loaders,
    })

    // 2. Create ReleaseFile list
    await tx.insert(releaseFile_table).values(
      input.files.map((file) => ({
        release_id: input.id,
        filename: file.filename,
        pathname: file.pathname,
        size: file.size,
        type: file.type,
        loaders: file.loaders,
        game_versions: file.game_versions,
      })),
    )

    // 3. Update the project table
    await tx
    .update(proj_table)
    .set({
      game_versions: sql`array_distinct(${proj_table.game_versions} || ${input.game_versions})`,
      loaders: sql`array_distinct(${proj_table.loaders} || ${input.loaders})`,
    })
    .where(eq(proj_table.id, input.project_id))

    return input
  })
}