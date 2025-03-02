import { db } from "~/lib/db";
import { projectRelease_table } from "~/lib/db/schema/proj";
import { eq, and, ilike, inArray, exists } from "drizzle-orm";

export const releaseIdById = async (id: string) => {
  const [release] = await db.select({
    id: projectRelease_table.id
  }).from(projectRelease_table).where(eq(projectRelease_table.id, id)).limit(1);
  return release;
}