import { z } from "zod/v4";
import { channelMessageInsertSchema } from "../../admin/db/service";

export const sendMsgSchema = channelMessageInsertSchema.omit({
  createdAt: true, updatedAt: true, isEdited: true, isDeleted: true, isPinned: true, id: true, mentions: true, reactions: true,
})
export type SendMsgInput = z.infer<typeof sendMsgSchema>;