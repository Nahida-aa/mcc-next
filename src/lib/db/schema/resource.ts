import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid, jsonb } from "drizzle-orm/pg-core"
import { timestamps, uuidCommon } from "./columnsHelpers"
import { tag } from "./tag";

export const resource = pgTable("Resource", {
  ...uuidCommon,
  downloadCount: integer("download_count").default(0).notNull(),
  favoriteCount: integer("favorite_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  image: varchar("image").notNull(),
  compatibility: jsonb("compatibility").$type<ResourceCompatibility>().notNull(), // 存储兼容性信息的 JSON 字段
  platforms: jsonb("platforms").$type<string[]>().notNull(), // 存储平台信息的 JSON 字段
  environments: jsonb("environments").$type<string[]>().notNull(), // 存储环境信息的 JSON 字段
}, (table) => [
  // index("ix_Resource_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
  index("ix_Resource_name").on(table.name),
]);

export const resourceRelations = relations(resource, ({many, one }) => ({
  tags: many(tag),
}));

// export type ResourceEnvironment = string[];
// export type ResourceCompatibility = Record<string, string>; // == { key: value, ... }
export type ResourceCompatibility = {
  version: string;
  versions: string[];
}[];

export const resourceTag = pgTable("ResourceTag", {
  resourceId: uuid("resource_id").notNull().references(() => resource.id),
  tagId: uuid("tag_id").notNull().references(() => tag.id),
}, (table) => [
  primaryKey({ columns: [table.resourceId, table.tagId], name: "ResourceTag_pkey" }),
]);

export const resourceTagRelations = relations(resourceTag, ({one}) => ({
  resource: one(resource, {
    fields: [resourceTag.resourceId],
    references: [resource.id]
  }),
  tag: one(tag, {
    fields: [resourceTag.tagId],
    references: [tag.id]
  }),
}))
