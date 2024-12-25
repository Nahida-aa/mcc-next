import { idCardInfo, user } from "@/server/db/schema/user";
import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const platformInfo_schema = z.object({
  startYear: z.number().nullable().optional().default(null),
  playReason: z.string().optional().default(""),
  serverType: z.array(z.string()).optional().default([]),
  favorite_content: z.array(z.string()).optional().default([]),
  desiredPartners: z.array(z.string()).optional().default([]),
});
export const idCardInfo_selectSchema = createSelectSchema(idCardInfo)
  // .extend({
  //   idCardNumber: z.string(),
  //   idCardHolder: z.string().nullable(),
  //   frontImageUrl: z.string().nullable(),
  //   backImageUrl: z.string().nullable(),
  // });
export const user_selectSchema = createSelectSchema(user)
  .extend({
    // createdAt: z.string(), // 将 createdAt 定义为字符串类型
    platform_info: platformInfo_schema.nullable(),
    idCardInfo: idCardInfo_selectSchema.nullable(),
  });

export const idCardInfo_insertSchema = createInsertSchema(idCardInfo)
  .omit({id: true, user_id: true, is_real_name: true})
  .required({
    id_card_number: true,
  })
  .extend({
    id_card_number: z.string().min(1),
    id_card_holder: z.string().optional().default("self").openapi({example: "self"}),
    front_image_url: z.string().optional(),
    back_image_url: z.string().optional(),
  });
export const user_insertSchema = createInsertSchema(user,
  {
    name: schema => schema.min(1),
    password: schema => schema.min(6),
    phone: schema => schema.min(1),
  }
)
  .omit({id: true, created_at: true, updated_at: true, lastLogin: true, 
    followers_count: true, following_count: true, 
    is_superuser: true, is_staff: true, is_active: true})
  .required({
    phone: true,
  })
  .extend({
    gender: z.string().nullable().default(null),
    age: z.number().nullable().default(null).openapi({example: null}),
    platform_info: platformInfo_schema.nullable().optional(),
    idCardInfo: idCardInfo_insertSchema,
  })

export const user_patchSchema = user_insertSchema.partial()