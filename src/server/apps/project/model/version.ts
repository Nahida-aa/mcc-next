import { projectVersion, versionFile } from "@/server/db/schema";
import { createInsertSchema, createSelectSchema } from "../../openapi/schemas/create";
import { z } from "@hono/zod-openapi";

export const versionSelectSchema = createSelectSchema(projectVersion);
export const versionFileSelectSchema = createSelectSchema(versionFile);

export const versionFileInsertSchema = createInsertSchema(versionFile).omit({id: true,  download_count: true, createdAt: true, updatedAt: true, sha1: true, sha256: true, size: true, upload_status: true, version_id:true,storage_key:true });

export const versionInsertSchema = createInsertSchema(projectVersion).omit({ id: true, downloadCount: true, createdAt: true, status: true, publisherId: true }).extend({
  versionFiles: z.array(versionFileInsertSchema),
});
// zod schema to type
export type VersionInsert = z.infer<typeof versionInsertSchema>;