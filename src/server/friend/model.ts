
import { friend } from "../admin/db/schema";
import { UserBase, userBaseSchema } from "../auth/model";
import { createSelectSchema } from "../openapi/schemas/create";


export const friendSelectSchema = createSelectSchema(friend);
export type FriendSelect = typeof friend.$inferSelect;

export const friendItemSchema = friendSelectSchema.omit({createdAt: true, updatedAt: true, status: true, reason: true}).extend({
  user1: userBaseSchema.nullable(),
  user2: userBaseSchema.nullable(),
});
export type FriendItem = {
  id: string;
  user1Id: string;
  user2Id: string;
  user1: UserBase | null
  user2: UserBase | null
};