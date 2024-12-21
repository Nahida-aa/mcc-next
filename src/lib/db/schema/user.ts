import { relations, type InferSelectModel } from 'drizzle-orm';
import { pgTable, varchar, index, timestamp, serial, integer, uniqueIndex, boolean, foreignKey, primaryKey, uuid, json, jsonb } from "drizzle-orm/pg-core"
import { timestamps, uuidCommon } from "./columnsHelpers"
import { linkGroupFollow, linkUserFollow, linkUserGroup, linkUserIdentity, linkUserProj, linkUserResource } from './link';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from '@hono/zod-openapi';

const platformInfoDefault = {
  startYear: null as number | null, // > 2009, 第一次玩 mc 的年份
  playReason: '', // 游戏原因
  serverType: [] as string[],  // 服务器类型: 服务器玩家 | 公益服 | 盈利服 | 多人竞技服 | 多人合作服
  favorite_content: [] as string[], // 喜欢哪些内容: 建筑|生存|冒险|科技
  desiredPartners: [] as string[], // 想在平台内结识怎样的伙伴
}
type PlatformInfo = typeof platformInfoDefault;

export const user = pgTable("User", {
  ...uuidCommon,
  password: varchar("password", { length: 64 }).notNull(),
  image: varchar(), // ?
  nickname: varchar("nickname", { length: 32 }),
  email: varchar('email', { length: 64 }),
  phone: varchar("phone", { length: 64 }), // 逻辑必填
  gender: varchar(),
  age: integer(),
  lastLogin: timestamp("last_login"),
  followersCount: integer("followers_count").default(0).notNull(), // 粉丝数
  followingCount: integer("following_count").default(0).notNull(), // 关注数
  isSuperuser: boolean("is_superuser").default(false).notNull(),
  isStaff: boolean("is_staff").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  platformInfo: jsonb("platform_info").$type<PlatformInfo>().default(platformInfoDefault),
}, (table) => [
  // index("ix_User_age").using("btree", table.age.asc().nullsLast().op("int4_ops")),
  index("ix_User_age").on(table.age),
  // uniqueIndex("ix_User_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
  uniqueIndex("ix_User_email").on(table.email),
  // uniqueIndex("ix_User_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
  uniqueIndex("ix_User_name").on(table.name),
  uniqueIndex("ix_User_phone").on(table.phone),
]);

export type User = InferSelectModel<typeof user>;



export const idCardInfo = pgTable("IDCardInfo", {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	userId: uuid("user_id"),
	idCardNumber: varchar("id_card_number"), // 身份证号 ? 逻辑必填
	idCardHolder: varchar("id_card_holder").default("self").notNull(), // 身份证持有人 自己:self | 监护人:guardian 
	isRealName: boolean("is_real_name"),
	frontImageUrl: varchar("front_image_url"),
	backImageUrl: varchar("back_image_url"),
}, (table) => [
	// uniqueIndex("ix_IDCardInfo_id_card_number").using("btree", table.idCardNumber.asc().nullsLast().op("text_ops")),
	uniqueIndex("ix_IDCardInfo_id_card_number").on(table.idCardNumber),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "IDCardInfo_user_id_fkey"
		}),
]);

export const userRelations = relations(user, ({one, many}) => ({
  home: one(home),
  idCardInfo: one(idCardInfo),
  followedGroupsLinks: many(linkGroupFollow), // 原 linkGroupFollows, 关注的团队们
  followedUsersLinks: many(linkUserFollow // 关注的用户们
    , {relationName: "linkUserFollow_target_user_id"} // table_field
  ),
  followsLinks: many(linkUserFollow // 粉丝们
    , {
    relationName: "linkUserFollow_user_id"
    }
  ),
  linkUserProjs: many(linkUserProj),
  linkUserResources: many(linkUserResource),
  linkUserGroups: many(linkUserGroup),
  linkUserIdentities: many(linkUserIdentity),
}));

export const idCardInfoRelations = relations(idCardInfo, ({one}) => ({
  user: one(user, {
    fields: [idCardInfo.userId],
    references: [user.id]
  }),
}));

export const identity = pgTable("Identity", {
	...uuidCommon,
}, (table) => [
	// index("ix_Identity_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("ix_Identity_name").on(table.name),
]);

export const home = pgTable("Home", {
	...uuidCommon,
	userId: uuid("user_id"),
	doorNumber: integer("door_number"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Home_user_id_fkey"
		}),
]);

export const homeRelations = relations(home, ({one}) => ({
	user: one(user, {
		fields: [home.userId],
		references: [user.id]
	}),
}));

export const platformInfoSchema = z.object({
  startYear: z.number().nullable().optional().default(null),
  playReason: z.string().optional().default(""),
  serverType: z.array(z.string()).optional().default([]),
  favorite_content: z.array(z.string()).optional().default([]),
  desiredPartners: z.array(z.string()).optional().default([]),
});
export const idCardInfoSelectSchema = createSelectSchema(idCardInfo)
  // .extend({
  //   idCardNumber: z.string(),
  //   idCardHolder: z.string().nullable(),
  //   frontImageUrl: z.string().nullable(),
  //   backImageUrl: z.string().nullable(),
  // });
export const userSelectSchema = createSelectSchema(user)
  .extend({
    // createdAt: z.string(), // 将 createdAt 定义为字符串类型
    platformInfo: platformInfoSchema.nullable(),
    idCardInfo: idCardInfoSelectSchema.nullable(),
  });

export const idCardInfoInsertSchema = createInsertSchema(idCardInfo)
  .omit({id: true, userId: true, isRealName: true})
  .required({
    idCardNumber: true,
  })
  .extend({
    idCardHolder: z.string().default("self"),
    frontImageUrl: z.string().optional(),
    backImageUrl: z.string().optional(),
  });
export const userInsertSchema = createInsertSchema(user,
  {
    name: schema => schema.min(1),
    password: schema => schema.min(6),
    phone: schema => schema.min(1),
  }
)
  .omit({id: true, createdAt: true, updatedAt: true, lastLogin: true, 
    followersCount: true, followingCount: true, 
    isSuperuser: true, isStaff: true, isActive: true})
  .required({
    phone: true,
  })
  .extend({
    gender: z.string().nullable().default(null),
    age: z.number().nullable().default(null).openapi({example: null}),
    platformInfo: platformInfoSchema.nullable().optional(),
    idCardInfo: idCardInfoInsertSchema,
  })
