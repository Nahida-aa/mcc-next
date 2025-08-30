import { Db } from "../../admin/db";
import { CommunityInsert } from "../../admin/db/service";
import { channel, community } from "../table";
import { joinMethod } from "../model/member";
import { addMember } from "./member";

export const _createCommunity = async(db: Db, data: CommunityInsert) => {
  // insert community , 暂时用于提供 一个社区空间
  const [newCommunity] = await db.insert(community).values(data).returning({id: community.id});

  // insert community member
  await addMember(db, {
    communityId: newCommunity.id,
    userId: data.ownerId,
    joinMethod: joinMethod.SYSTEM,
    isOwner: true, // 设置 设置冗余
    // TODO: role
  });

  return newCommunity;
}